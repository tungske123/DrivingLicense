use DrivingLicense;
go
-----------------------------------[ CREATE ACCOUNT USER ]-------------------------------
create or alter procedure proc_signUpAccount @username nvarchar(100), @password nvarchar(100), @email nvarchar(100),@name nvarchar(100)
as
begin
   declare @AccountID as nvarchar(50);

   -- Declare temporary table
   declare @InsertedIDs table (AccountID nvarchar(50));
   insert into dbo.Account (Username, [Password], [Role])
   output inserted.AccountID into @InsertedIDs(AccountID)
   values(@username, @password, 'user');

   -- Get accountID from temp table
   select @AccountID = AccountID from @InsertedIDs;
   insert into dbo.Users(AccountID,FullName,Email)
   values(@AccountID, @name, @email);
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
	@Describe nvarchar(max),
	@quantity int
)
as
begin
	--INSERT ANOTHER QUIZ
	insert into Quiz(LicenseID, [Name], [Description]) values (@LicenseID, @Name, @Describe);
	declare @QuizID int;
	set @QuizID = SCOPE_IDENTITY();

	--DECLARE TEMP TABLE FOR SUBQUERY
	declare @NonCritical_table table (RolledID int);
	declare @Critical_table table (RolledID int);
	declare @combined_table table (questionid int);

	--INSERT NEW ROLL RESULT SUITABLE CONDITION
	insert into @NonCritical_table
	select top(@quantity-4) QuestionID from Question where (LicenseID = @LicenseID and isCritical=0) order by newid();

	insert into @Critical_table
	select top(4) QuestionID from Question where (LicenseID=@LicenseID and isCritical=1) order by newid();

	--COMBINE ROLLED QUESTION
	INSERT INTO @Combined_table
	select * from @noncritical_table
	union all
	select * from @Critical_table;

	--INSERT RESULT
	insert into Have (QuizID, QuestionID)
	select @QuizID, QuestionID FROM @Combined_table;

	--RESET ROLLED RANDOM
	delete from @combined_table;
end;
go

--exec proc_CreateQuiz N'Đề số 2 của hạng A1','A1','Mô tả', 25;

-----------------------------------[ Roll Question Of Quiz]-------------------------------
create or alter procedure proc_RollQuestion (
	@QuizID int,
	@OldQuestionID int
)
as
begin
	--DECLARE TEMP TABLE FOR SUBQUERY
	declare @Question_table table (QuestionID int);

	--GET ALL QUESTION NOT IN QUIZ
	insert into @Question_table
	select QuestionID from Question 
	where QuestionID not in (select QuestionID from Have where QuizID = @QuizID);


	--GET NEW RANDOM QUESTION
	declare @NewQuestionID int;
	select top 1 @NewQuestionID = QuestionID from @Question_table order by newid();

	--UPDATE QUESTION IN QUIZ
	update Have set QuestionID = @NewQuestionID where QuizID = @QuizID and QuestionID = @OldQuestionID;
end;
go

--exec proc_ChangeQuestion 1, 2; (QuizID, QuestionID) in database

--==================================================================================
--==================================================================================
-----------------------------------[ DELETE SCHEDULE]-------------------------------
create or alter procedure proc_DeleteSchedule(
	@ScheduleID uniqueidentifier,
	@UserID uniqueidentifier,
	@TeacherID uniqueidentifier,
	@LicenseID nvarchar(10)
)
as
begin
	delete from Schedule where ScheduleID = @ScheduleID;
	delete from Schedule where UserID = @UserID;
    delete from Schedule where TeacherID = @TeacherID;
	delete from Schedule where LicenseID = @LicenseID;
end;
go

-----------------------------------[ DELETE HAVE]-------------------------------
create or alter procedure proc_DeleteHave(
	@QuizID int,
	@QuestionID int
)
as
begin
	delete from Have where QuizID = @QuizID;
	delete from Have where QuestionID = @QuestionID;
end;
go

-----------------------------------[ DELETE RENT]-------------------------------
create or alter procedure proc_DeleteRent(
	@RentID uniqueidentifier,
   @VehicleID uniqueidentifier,
   @UserID uniqueidentifier
)
as
begin
	delete from Rent where RentID = @RentID;
	delete from Rent where VehicleID = @VehicleID;
	delete from Rent where UserID = @UserID;
end;
go

-----------------------------------[ DELETE ATTEMPT DETAIL ]-------------------------------
create or alter procedure proc_DeleteAttemptdDetail(
	@AttemptDetailID uniqueidentifier,
	@AttemptID uniqueidentifier,
	@QuestionID int
)
as
begin
	delete from AttemptDetail where AttemptDetailID = @AttemptDetailID;
	delete from AttemptDetail where AttemptID = @AttemptID;
	delete from AttemptDetail where QuestionID = @QuestionID;
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
	if @UserID is not null
	begin
		declare @AttmpDetail table (AttmpId uniqueidentifier);

		insert into @AttmpDetail (AttmpId)
		select AttemptID from Attempt where UserID = @UserID;

		delete from AttemptDetail where AttemptID in (select AttmpId from @AttmpDetail);
	end

	delete from Attempt where AttemptID = @AttemptID;
	delete from Attempt where UserID = @UserID;
    delete from Attempt where QuizID = @QuizID;
end;
go

-----------------------------------[ Delete Quiz ]-------------------------------
create or alter procedure proc_DeleteQuiz(
	@quizID int,
	@LicenseID nvarchar(10)
)
as 
begin
	delete from Quiz where LicenseID= @LicenseID;
	delete from Quiz where QuizID = @quizID;
end;
go

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

-----------------------------------[ DELETE USER ]-------------------------------
create or alter procedure proc_DeleteUser(
	@AccountID uniqueidentifier,
	@UserID uniqueidentifier
)
as 
begin
	exec proc_DeleteSchedule null,@UserID,null,null;
	exec proc_DeleteRent null,null,@UserID;
	exec proc_DeleteAttempt null,@UserID,null;
	delete from Users where UserID = @UserID;
	delete from Account where AccountID = @AccountID;
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

-----------------------------------[ CHANGE ROLE ]-------------------------------
create or alter procedure proc_changeRole @accountID nvarchar(50), @fullname nvarchar(100), @email nvarchar(100), @roleNew nvarchar(50)
as
begin
	declare @roleOld nvarchar(50);
	set @roleOld = (select [Role] from dbo.Account where AccountID = @accountID)
	
	if (@roleNew = N'Giảng viên') 
	begin
		insert into dbo.Teacher(AccountID, Fullname, Email) --insert new teacher
		values(@AccountID, @fullname, @email)
		update Account set Role=@roleNew where AccountID = @accountID;--update role of account
	end

	else if (@roleNew = N'Nhân viên')
	begin
		insert into dbo.Staff(AccountID, Fullname ,Email)
		values(@AccountID, @fullname, @email);
		update Account set Role=@roleNew where AccountID = @accountID; --update role of account
	end

	else if (@roleNew = N'Quản trị viên')
	begin
		insert into dbo.[Admin](AccountID, Fullname ,Email)
		values(@AccountID, @fullname, @email);
		update Account set Role=@roleNew where AccountID = @accountID; --update role of account
	end

	else if (@roleNew = 'Người dùng')
	begin
		insert into dbo.Users(AccountID, Fullname ,Email)
		values(@AccountID, @fullname, @email);
		update Account set Role=@roleNew where AccountID = @accountID; --update role of account
	end
end;
*/
use master;