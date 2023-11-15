use DrivingLicense;
go
-----------------------------------[ CREATE ACCOUNT USER ]-------------------------------
create or alter procedure proc_signUpAccount(
	@username nvarchar(100),
	@password nvarchar(100),
	@email nvarchar(100),
	@roleSet nvarchar(50) = 'user'		--default value
)
as
begin
	-- Declare
	declare @accountID as uniqueidentifier;
	declare @Temptable table (accId uniqueidentifier);

	--Create an account and save its id to a temp table
	insert into dbo.Account (Username, [Password], [Role])
	output inserted.AccountID into @Temptable(AccId)
	values(@username, @password, @roleSet);
	set @accountID = (select top(1) AccId from @Temptable);

	if(@roleSet = 'user')
	begin
		insert into dbo.Users(AccountID,Email) values(@accountID, @email);
	end;
	else
	begin
		if(@roleSet = 'lecturer' and not exists(select * from dbo.Teacher where AccountID = @accountID))
		insert into dbo.Teacher(AccountID, Email)values(@accountID,@email);

		else if(@roleSet = 'staff' and not exists(select * from dbo.Staff where AccountID = @accountID))
		insert into dbo.Staff(AccountID,Email)values(@accountID, @email);

		else if(@roleSet = 'admin'and not exists(select * from dbo.[Admin] where AccountID = @accountID))
		insert into dbo.[Admin](AccountID,Email)values(@accountID,@email);
	end;
end;
go

create or alter view vw_getAllAccountEmails
as
select 'user' as 'Role', AccountID, Email
from dbo.Users
union all
select 'teacher' as 'Role', AccountID, Email
from dbo.Teacher;
go

-----------------------------------[ GENERATE QUIZ ]-------------------------------
create or alter procedure proc_CreateQuiz (
	@Name nvarchar(100),
	@LicenseID nvarchar(10),
	@Description nvarchar(max),
	@QuestQuantity int
)
as
begin
	--QUERY LICENSE FOR TIMER
	declare @duration int;
	if (@LicenseID in ('A1', 'A2', 'A3', 'A4', 'B1')) set @duration = 1201;--20 minutes
	else if (@LicenseID = 'B2') set @duration = 1321;--22 minutes
	else if (@LicenseID = 'C') set @duration = 1441;--24 minutes
	else set @duration = 1561;--26 minutes

	--Create a quiz
	insert into Quiz(LicenseID, [Name], [Description], Timer, TotalDid) values (@LicenseID, @Name, @Description,@duration ,0);
	declare @QuizID int;
	set @QuizID = SCOPE_IDENTITY();

	--Declare temp table for subquery
	declare @NonCritical_table table (RolledID int);
	declare @Critical_table table (RolledID int);
	declare @combined_table table (questionid int);

	--Insert new roll result suitable condition
	insert into @NonCritical_table
	select top(@QuestQuantity-4) QuestionID from Question where (LicenseID = @LicenseID and isCritical=0) order by newid();

	insert into @Critical_table
	select top(4) QuestionID from Question where (LicenseID=@LicenseID and isCritical=1) order by newid();

	--Combine rolled question
	INSERT INTO @Combined_table
	select * from @noncritical_table
	union all
	select * from @Critical_table;

	--Insert result
	insert into Have (QuizID, QuestionID)
	select @QuizID, QuestionID FROM @Combined_table;

	--Reset rolled random
	delete from @combined_table;
end;
go

--exec proc_CreateQuiz N'Đề số 2 của hạng A1', 'A1','Mô tả', 25;

-----------------------------------[ ROLL QUESTION OF QUIZ]-------------------------------
create or alter procedure proc_RollQuestion (
	@QuizID int,
	@OldQuestionID int
)
as
begin
	--Declare temp table for subquery
	declare @Question_table table (QuestionID int);

	--Get all question not in quiz
	insert into @Question_table
	select QuestionID from Question 
	where QuestionID not in (select QuestionID from Have where QuizID = @QuizID);


	--Get new random question
	declare @NewQuestionID int;
	select top 1 @NewQuestionID = QuestionID from @Question_table order by newid();

	--UPDATE QUESTION IN QUIZ
	update Have set QuestionID = @NewQuestionID where QuizID = @QuizID and QuestionID = @OldQuestionID;
end;
go

--exec proc_ChangeQuestion 1, 2; (QuizID, QuestionID) in database

--|================================|============|=============================|--
--|================================|============|=============================|--
--|--------------------------------[ DELETE HIRE]-----------------------------|--
create or alter procedure proc_DeleteHire(
	@HireID uniqueidentifier,
	@TeacherID uniqueidentifier,
	@UserID uniqueidentifier
)
as
begin
	--Declare
	declare @Tempt table (hireId uniqueidentifier);

	--Case 1:
	if (@HireID is not null) delete from dbo.Schedule where HireID = @HireID;	--Remove constain

	--Case 2:
	if @TeacherID is not null
	begin
		insert into @Tempt select HireID from Hire where TeacherID = @TeacherID;--Query all hire of teacher

		delete from dbo.Schedule where HireID in (select hireId from @Tempt);	--Remove constain
	end

	--Case 3:
	if (@UserID is not null)
	begin
		delete from @Tempt;														--Reset Tempt Table
		insert into @Tempt select HireID from Hire where UserID = @UserID;		--Query all hire of user

		delete from dbo.Schedule where HireID in (select hireId from @Tempt);	--Remove constain
	end

	--Delete after remove constrain
	delete from Hire where HireID = @HireID;
	delete from Hire where TeacherID = @TeacherID
	delete from Hire where UserID = @UserID;
end;
go

-----------------------------------[ DELETE ATTEMPT ]-------------------------------
create or alter procedure proc_DeleteAttempt(
	@AttemptID uniqueidentifier,
	@UserID uniqueidentifier,
	@QuizID int
)
as
begin
	--Declare tempt table
	declare @Tempt table (attemptId uniqueidentifier);
	
	--Case 1:
	if (@AttemptID is not null) delete from AttemptDetail where AttemptID = @AttemptID;--Remove constrain

	--Case 2:
	if (@UserID is not null)
	begin
		--Query all attempt of user
		insert into @Tempt select AttemptID from Attempt where UserID = @UserID;

		--Remove all constrain of user's attempts
		delete from AttemptDetail where AttemptID in (select attemptId from @Tempt);
	end

	--Case 3:
	if (@QuizID is not null)
	begin
		--Reset Tempt Table
		delete from @Tempt;

		--Query all attempt of user
		insert into @Tempt select AttemptID from Attempt where QuizID = @QuizID;

		--Remove all constrain of quiz's attempts
		delete from AttemptDetail where AttemptID in (select attemptId from @Tempt);
	end

	--Delete after remove constrain
	delete from Attempt where AttemptID = @AttemptID;
	delete from Attempt where UserID = @UserID;
    delete from Attempt where QuizID = @QuizID;
end;
go

-----------------------------------[ DELETE QUIZ ]-------------------------------
create or alter procedure proc_DeleteQuiz(
	@quizID int,
	@LicenseID nvarchar(10)
)
as 
begin
	--Remove constain
	exec proc_DeleteAttempt null,null,@quizID;
	delete from Have where QuizID = @quizID;

	--Then delete
	delete from Quiz where QuizID = @quizID;
	delete from Quiz where LicenseID= @LicenseID;
end;
go
/*
-----------------------------------[ Delete Quiz Question]-------------------------------
create or alter procedure proc_DeleteQuizQuest(
	@quizID int,
	@questID int
)
as 
begin
	delete from Have where QuizID = @quizID and QuestionID = @questID;
end;
go
*/

-----------------------------------[ DELETE FEEDBACK ]-------------------------------
create or alter procedure proc_DeleteFeedback(
	@FeedbackID uniqueidentifier,
	@userID uniqueidentifier
)
as 
begin
	--Case 1:--Remove constrain
	if (@FeedbackID is not null) delete from dbo.Response where FeedbackID = @FeedbackID;

	--Case 2:--Remove constrain
	if (@UserID is not null)delete from dbo.Response where UserID = @UserID;			

	--Delete after remove constrain
	delete from Feedback where FeedbackID = @FeedbackID;
	delete from Feedback where userID = @userID;
end;
go

-----------------------------------[ DELETE USER ]-------------------------------
create or alter procedure proc_DeleteUser(
	@AccountID uniqueidentifier,
	@UserID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)--'yes' || 'no'
)
as 
begin
	if(@UserID = null or @UserID = '') set @UserID = (select UserID from Users where AccountID = @AccountID);
	
	--Remove constains
	delete from dbo.Rent where UserID = @UserID;
	delete from dbo.ExamProfile where UserID = @UserID;
	exec proc_DeleteHire null,null,@UserID;
	exec proc_DeleteAttempt null,@UserID,null;
	exec proc_DeleteFeedback null,@UserID;

	--Then delete
	delete from Users where UserID = @UserID;			

	if(@confirm_DeleteAccount = 'yes')
	begin
		if(@AccountID = null or @AccountID = '') set @AccountID = (select AccountID from Users where UserID = @UserID);
		delete from Account where AccountID = @AccountID and [Role] = 'user';
	end
end;
go

-----------------------------------[ DELETE TEACHER ]-------------------------------
create or alter procedure proc_DeleteLecturer(
	@AccountID uniqueidentifier,
	@TeacherID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)--'yes' || 'no'
)
as 
begin
	if(@TeacherID = null or @TeacherID = '') set @TeacherID = (select TeacherID from Teacher where AccountID = @AccountID);
	exec proc_DeleteHire null,@TeacherID,null;				--Remove constain

	delete from Teacher where TeacherID = @TeacherID;		--Then delete

	if(@confirm_DeleteAccount = 'yes')
	begin
		if(@AccountID = null or @AccountID = '') set @AccountID = (select AccountID from Teacher where TeacherID = @TeacherID);
		delete from Account where AccountID = @AccountID and [Role] = 'lecturer';
	end
end;
go

-----------------------------------[ DELETE STAFF ]-------------------------------
create or alter procedure proc_DeleteStaff(
	@AccountID uniqueidentifier,
	@StaffID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)--'yes' || 'no'
)
as 
begin
	if(@StaffID = null or @StaffID = '') set @StaffID = (select StaffID from Staff where AccountID = @AccountID);
	delete from dbo.Response where StaffID = @StaffID;		--Remove constain

	delete from Staff where StaffID = @StaffID;				--Then delete

	if(@confirm_DeleteAccount = 'yes')
	begin
		if(@AccountID = null or @AccountID = '') set @AccountID = (select AccountID from Staff where StaffID = @StaffID);
		delete from Account where AccountID = @AccountID and [Role] = 'staff';
	end
end;
go

-----------------------------------[ DELETE ADMIN ]-------------------------------
create or alter procedure proc_DeleteAdmin(
	@AccountID uniqueidentifier,
	@AdminID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)--'yes' || 'no'
)
as 
begin
	if(@AdminID = null or @AdminID = '') set @AdminID = (select AdminID from [Admin] where AccountID = @AccountID);
	delete from [Admin] where AdminID = @AdminID;

	if(@confirm_DeleteAccount = 'yes')
	begin
		if(@AccountID = null or @AccountID = '') set @AccountID = (select AccountID from [Admin] where AdminID = @AdminID);
		delete from Account where AccountID = @AccountID and [Role] = 'admin';
	end
end;
go

-------------------------------------------[ CHANGE ROLE ]----------------------------------------------
create or alter procedure proc_changeRole(
	@accountID nvarchar(50),
	@roleNew nvarchar(50),
	@LicenseSet nvarchar(10) = 'A1'		--default value
)
as
begin
	--Declare
	declare @roleOld as nvarchar(50);
	declare @avatar nvarchar(max);
	declare @Tempt as table(email nvarchar(100), fullname nvarchar(100), telephone nvarchar(20));

	set @roleOld = (select [Role] from dbo.Account where AccountID = @accountID);

	--Case 1:
	if(@roleOld = 'user')
	begin
		set @avatar = (select Avatar from dbo.Users where AccountID = @accountID);
		insert into @Tempt(email, fullname, telephone)
		select Email, FullName, PhoneNumber from dbo.Users where AccountID = @accountID;

		
		exec proc_DeleteUser @accountID,null,'no';--Delete old record
	end;

	--Case 2:
	else if(@roleOld = 'lecturer')
	begin
		set @avatar = (select Avatar from dbo.Users where AccountID = @accountID);
		insert into @Tempt(email, fullname, telephone)
		select Email, FullName, ContactNumber from dbo.Teacher where AccountID = @accountID;

		exec proc_DeleteLecturer @accountID,null,'no';--Delete old record
	end;

	--Case 3:
	else if(@roleOld = 'staff')
	begin
		insert into @Tempt(email, fullname, telephone)
		select Email, FullName, ContactNumber from dbo.Staff where AccountID = @accountID;

		exec proc_DeleteStaff @accountID,null,'no';--Delete old record
	end;

	--Case 4:
	else
	begin
		insert into @Tempt(email, fullname, telephone)
		select Email, FullName, ContactNumber from dbo.[Admin] where AccountID = @accountID;
		
		exec proc_DeleteAdmin @accountID,null,'no';--Delete old record
	end;

	--//--//--//--//--//--
	if(@roleOld!=@roleNew)
	begin
		--______________________ Update Role______________________
		if (@roleNew = 'lecturer') 
		begin
			insert into dbo.Teacher(AccountID, Fullname, Email, ContactNumber)	--insert new teacher
			select @accountID, fullname, email, telephone from @Tempt;
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if (@roleNew = 'staff')
		begin
			insert into dbo.Staff(AccountID, Fullname ,Email, ContactNumber)	--insert new teacher
			select @accountID, fullname, email, telephone from @Tempt;
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if (@roleNew = 'admin')
		begin
			insert into dbo.[Admin](AccountID, Fullname ,Email, ContactNumber)--insert new admin
			select @accountID, fullname, email, telephone from @Tempt;
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if(@roleNew = 'user')
		begin
			insert into dbo.Users(AccountID, Fullname, Email, PhoneNumber)		--insert new user
			select @accountID, fullname, email, telephone from @Tempt;
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end
	end
end;
go

-------------------------------------------[ CALCULATE QUIZ RESULT ]----------------------------------------------
create or alter procedure [dbo].[proc_CalculateQuizResult](
	@AttemptID uniqueidentifier
)
as
begin
	--DECLARE
	declare @TotalCorrect as int;
	declare @TotalIncorrect as int;
	declare @TotalQuestionCnt as int;
	declare @QuizID as int;
	declare @RemainingQuestion as int;
	declare @AttemptDate as date;

	--SET VALUES
	set @AttemptDate = (select AttemptDate from dbo.Attempt where AttemptID = @AttemptID);
	set @QuizID = (select QuizID from dbo.Attempt where AttemptID = @AttemptID);
	set @TotalCorrect = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and [Status] = 'true');
	set @TotalIncorrect = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and [Status] = 'false');
	set @TotalQuestionCnt = (select count(*) from dbo.Have where QuizID = @QuizID);
	set @RemainingQuestion = @TotalQuestionCnt - @TotalCorrect - @TotalIncorrect;

	select @AttemptID as 'AttemptID',
	(select [Name] from dbo.Quiz where QuizID = @QuizID) as 'QuizName', 
	(select LicenseID from dbo.Quiz where QuizID = @QuizID) as 'License',
	@AttemptDate as 'AttemptDate',
	@TotalQuestionCnt as 'TotalQuestion',
	@TotalCorrect as 'CorrectQuestion',
	@TotalIncorrect as 'IncorrectQuestion',
	@RemainingQuestion as 'RemainingQuestion'
	from dbo.AttemptDetail att
	where att.AttemptID = @AttemptID
	group by att.AttemptID;
end;


-----------------------------------------------------------------------------------------------
go
create or alter procedure [dbo].[proc_getAllAttemptsDataFromUsers] @UserId uniqueidentifier
as
-- Create a temporary table to store results
create table #AttemptResults (
    AttemptID uniqueidentifier,
    QuizName nvarchar(max),
    License nvarchar(max),
    AttemptDate date,
    TotalQuestion int,
    CorrectQuestion int,
    IncorrectQuestion int,
    RemainingQuestion int
);

-- Iterate through each attempt for the user
declare @AttemptID uniqueidentifier;

declare AttemptCursor cursor for
select AttemptID
from dbo.Attempt
where UserId = @UserId;  -- Replace with the actual column name that represents the user's ID

open AttemptCursor;
fetch next from AttemptCursor into @AttemptID;

while @@fetch_status = 0
begin
    declare @TotalCorrect as int;
    declare @TotalIncorrect as int;
    declare @TotalQuestionCnt as int;
    declare @QuizID as int;
    declare @Result as decimal(18, 2);
    declare @RemainingQuestion as int;
    declare @AttemptDate as date;

    set @AttemptDate = (select AttemptDate from dbo.Attempt where AttemptID = @AttemptID);
    set @QuizID = (select QuizID from dbo.Attempt where AttemptID = @AttemptID);
    set @TotalCorrect = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and [Status] = 'true');
    set @TotalIncorrect = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and [Status] = 'false');
    set @TotalQuestionCnt = (select count(*) from dbo.Have where QuizID = @QuizID);
    set @RemainingQuestion = @TotalQuestionCnt - @TotalCorrect - @TotalIncorrect;

    insert into #AttemptResults (AttemptID, QuizName, License, AttemptDate, TotalQuestion, CorrectQuestion, IncorrectQuestion, RemainingQuestion/*, Result*/)
    select
	    @AttemptID as 'AttemptID',
        (select [Name] from dbo.Quiz where QuizID = @QuizID),
        (select LicenseID from dbo.Quiz where QuizID = @QuizID),
        @AttemptDate,
        @TotalQuestionCnt,
        @TotalCorrect,
        @TotalIncorrect,
        @RemainingQuestion--,
      --@Result;

    fetch next from AttemptCursor into @AttemptID;
end;

close AttemptCursor;
deallocate AttemptCursor;

-- Select the results from the temporary table
select * from #AttemptResults;

-- Drop the temporary table
drop table #AttemptResults;


-----------------------------------------------------------------------------------------------
go
create or alter procedure [dbo].[proc_GetQuizAttempStats] @AttemptID uniqueidentifier
as
begin
    select
        q.QuestionText,
        case
            when att.SelectedAnswerID is not null then (select AnswerText from dbo.Answer where AnswerID = att.SelectedAnswerID)
            else null -- UserAnswer is NULL for questions without user answers
        end AS 'UserAnswer',
        (select a.AnswerText from dbo.Answer a where a.QuestionID = q.QuestionID and a.isCorrect = 1) as 'CorrectAnswer',
        case
            when att.SelectedAnswerID is null then 0 -- Set IsCorrect to 0 for questions without user answers
          --else att.IsCorrect
        end as 'IsCorrect'
    from
        dbo.Question q
    left join
        dbo.AttemptDetail att on q.QuestionID = att.QuestionID and att.AttemptID = @AttemptID
    where
        q.QuestionID IN (
            select QuestionID
            from dbo.Have
            where QuizID = (select QuizID from dbo.Attempt where AttemptID = @AttemptID)
        );
end;
go
/*
-----------------------------------[ COUNT CORRECT ANSWER ]-------------------------------
create or alter function fn_CountCorrect (
	@QuestionID int,
	@SelectedAnsID int,

)
returns int
as 
begin
	
end;
go

-----------------------------------[ CALCULATE MONEY / TIME ]-------------------------------
create or alter function fn_TotalTime (@start time, @end time)
returns int
as
begin
	return DATEDIFF(hour, @start, @end);
end;
go

-----------------------------------[ create schedule ]-------------------------------
create or alter function fn_GetUserID (@email nvarchar(100), @fullname nvarchar(100))
returns nvarchar(50)
as
begin
   declare @UserID as nvarchar(50);
   select @UserID = convert(nvarchar(50), UserID)
   from dbo.Users
   where Email = @email and FullName = @fullname;
   return @UserID;
end;
go

create or alter function fn_GetTeacherID (@email nvarchar(100), @fullname nvarchar(100))
returns nvarchar(50)
as
begin
   declare @TeacherID as nvarchar(50);
   select @TeacherID = convert(nvarchar(50), TeacherID)
   from dbo.Teacher
   where Email = @email and FullName = @fullname;
   return @TeacherID;
end;
go

create or alter procedure proc_CreateSchedule
(
	@userid nvarchar(50),
	@teacherid nvarchar(50),
    @licenseid nvarchar(10),
    @starttime time,
    @endtime time,
    @date date,
	@address nvarchar(100)
)
as
begin
	--CÁCH 1
	--declare @userid as nvarchar(50);
	--set @userid = dbo.fn_GetUserID(@mailUser, @nameUser);

	--declare @teacherid as nvarchar(50);
	--set @teacherid = dbo.fn_GetTeacherID(@mailGV, @nameGV);
	
	
	declare @giaTien decimal;
	set @giaTien = (select Price from dbo.Teacher where TeacherID=@teacherid);

	declare @thoiGian int;
	set @thoiGian = dbo.fn_TotalTime(@starttime, @endtime);

	declare @priceTotal decimal;
	set @priceTotal = @giaTien * @thoiGian;

	--INSERT NEW SCHEDULE
    insert into dbo.Schedule (UserID, TeacherID, LicenseID, StartTime, EndTime, [Date], PriceTotal, [Address], [Status]) values
	(@userid, @teacherid, @licenseid, @starttime, @endtime, @date, @priceTotal, @address, 'Pending')
end;
go
*/

use master;