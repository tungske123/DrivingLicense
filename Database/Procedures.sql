use DrivingLicense;
go
-----------------------------------[ CREATE ACCOUNT USER ]-------------------------------
create or alter procedure proc_signUpAccount(
	@username nvarchar(100),
	@password nvarchar(100),
	@email nvarchar(100),
	@name nvarchar(100),
	@roleSet nvarchar(50) = 'user'		--default value
)
as
begin
   declare @AccountID as nvarchar(50);

   -- Declare temporary table
   declare @InsertedIDs table (AccountID nvarchar(50));
   insert into dbo.Account (Username, [Password], [Role])
   output inserted.AccountID into @InsertedIDs(AccountID)
   values(@username, @password, @roleSet);

   -- Get accountID from temp table
   select @AccountID = AccountID from @InsertedIDs;
   insert into dbo.Users(AccountID,FullName,Email)
   values(@AccountID, @name, @email);

   if(@roleSet != 'user')
   begin
		exec proc_changeRole @AccountID, @name, @email, null, @roleSet;
	end
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
	@quantity int
)
as
begin
	--INSERT ANOTHER QUIZ
	insert into Quiz(LicenseID, [Name], [Description]) values (@LicenseID, @Name, @Description);
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

	if @QuizID is not null
	begin
		declare @AttemDetail table (AttemId uniqueidentifier);

		insert into @AttemDetail (AttemId)
		select AttemptID from Attempt where QuizID = @QuizID;

		delete from AttemptDetail where AttemptID in (select AttemId from @AttemDetail);
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
	exec proc_DeleteAttempt null,null,@quizID;
	exec proc_DeleteHave @quizID,null;

	delete from Quiz where LicenseID= @LicenseID;
	delete from Quiz where QuizID = @quizID;
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
-----------------------------------[ Delete RateReply]-------------------------------
create or alter procedure proc_DeleteRateReply(
	@ReplyID int,
	@reportRID int,
	@userID uniqueidentifier,
	@staffID uniqueidentifier
)
as 
begin
	delete from RateReply where ReplyID = @ReplyID;
	delete from RateReply where reportRID = @reportRID;
	delete from RateReply where userID = @userID;
	delete from RateReply where staffID= @staffID;
end;
go

-----------------------------------[ Delete ReportRate]-------------------------------
create or alter procedure proc_DeleteReportRate(
	@ReportRID int,
	@userID uniqueidentifier
)
as 
begin
	exec proc_DeleteRateReply null,@ReportRID,@userID,null;

	delete from ReportRate where ReportRID = @ReportRID;
	delete from ReportRate where userID = @userID;
end;
go

-----------------------------------[ Delete ReportSystem]-------------------------------
create or alter procedure proc_DeleteReportSystem(
	@ReportSID int,
	@staffID uniqueidentifier
)
as 
begin
	delete from ReportSystem where ReportSID = @ReportSID;
	delete from ReportSystem where staffID = @staffID;
end;
go

-----------------------------------[ DELETE USER ]-------------------------------
create or alter procedure proc_DeleteUser(
	@AccountID uniqueidentifier,
	@UserID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)
)
as 
begin
	if(@UserID = null or @UserID = '') set @UserID = (select UserID from Users where AccountID = @AccountID);
	exec proc_DeleteSchedule null,@UserID,null,null;	--Remove constain
	exec proc_DeleteRent null,null,@UserID;				--Remove constain
	exec proc_DeleteAttempt null,@UserID,null;			--Remove constain
	exec proc_DeleteReportRate null,@UserID;			--Remove constain

	delete from Users where UserID = @UserID;			--Then delete

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
	@confirm_DeleteAccount varchar(10)
)
as 
begin
	if(@TeacherID = null or @TeacherID = '') set @TeacherID = (select TeacherID from Teacher where AccountID = @AccountID);
	exec proc_DeleteSchedule null,null ,@TeacherID ,null;	--Remove constain

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
	@confirm_DeleteAccount varchar(10)
)
as 
begin
	if(@StaffID = null or @StaffID = '') set @StaffID = (select StaffID from Staff where AccountID = @AccountID);
	exec proc_DeleteRateReply null,null,null,@StaffID;		--Remove constain
	exec proc_DeleteReportSystem null,@StaffID;				--Remove constain

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
	@AdministratorID uniqueidentifier,
	@confirm_DeleteAccount varchar(10)
)
as 
begin
	if(@AdministratorID = null or @AdministratorID = '') set @AdministratorID = (select AdministratorID from Administrator where AccountID = @AccountID);
	delete from Administrator where AdministratorID = @AdministratorID;

	if(@confirm_DeleteAccount = 'yes')
	begin
		if(@AccountID = null or @AccountID = '') set @AccountID = (select AccountID from Administrator where AdministratorID = @AdministratorID);
		delete from Account where AccountID = @AccountID and [Role] = 'admin';
	end
end;
go

-------------------------------------------[ CHANGE ROLE ]----------------------------------------------
create or alter procedure proc_changeRole(
	@accountID nvarchar(50),
	@fullname nvarchar(100),
	@email nvarchar(100),
	@phoneNum nvarchar(20),
	@roleNew nvarchar(50)
)
as
begin
	declare @roleOld nvarchar(50);
	set @roleOld = (select [Role] from dbo.Account where AccountID = @accountID)

	if(@roleNew != @roleOld)
	begin
		--______________________ Update Role______________________
		if (@roleNew = 'lecturer') 
		begin
			insert into dbo.Teacher(AccountID, Fullname, Email, ContactNumber)	--insert new teacher
			values(@accountID, @fullname, @email, @phoneNum)
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if (@roleNew = 'staff')
		begin
			insert into dbo.Staff(AccountID, Fullname ,Email, ContactNumber)	--insert new teacher
			values(@accountID, @fullname, @email, @phoneNum);
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if (@roleNew = 'admin')
		begin
			insert into dbo.Administrator(AccountID, Fullname ,Email, ContactNumber)--insert new admin
			values(@accountID, @fullname, @email, @phoneNum);
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		else if(@roleNew = 'user')
		begin
			insert into dbo.Users(AccountID, Fullname, Email, PhoneNumber)		--insert new user
			values(@accountID, @fullname, @email, @phoneNum);
			update Account set [Role] = @roleNew where AccountID = @accountID;		--update role of account
		end

		--______________________ Delete Old Record______________________
		if(@roleOld = 'lecturer') exec proc_DeleteLecturer @accountID,null,'no';
		else if (@roleOld = 'staff') exec proc_DeleteStaff @accountID,null,'no';
		else if (@roleOld = 'admin') exec proc_DeleteAdmin @accountID,null,'no';
		else if (@roleOld = 'user') exec proc_DeleteUser @accountID,null,'no';
	end
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