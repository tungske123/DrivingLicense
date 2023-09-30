use DrivingLicense;
go
-----------------------------------[ CREATE ACCOUNT USER ]-------------------------------
create or alter procedure proc_signUpAccount @username nvarchar(100), @password nvarchar(100), @email nvarchar(100)
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
   insert into dbo.Users(AccountID,Email)
   values(@AccountID, @email);
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
	@quantity int
)
as
begin
	--INSERT ANOTHER QUIZ
	insert into Quiz(LicenseID, [Name]) values (@LicenseID, @Name);
	declare @QuizID int;
	set @QuizID = (select QuizID from Quiz where LicenseID = @LicenseID and [Name] = @Name);

	--GENERATE N NUMBER RANDOMLY FROM QUESTION
	declare @Rolled_table table (RolledID int);
	declare @CriticalNum int = 0;

	while(@CriticalNum < 2 or @CriticalNum > 4)
	begin
		--RESET OLD ROLL RESULT
		delete from @Rolled_table;

		--INSERT NEW ROLL RESULT
		insert into @Rolled_table
		select top(@quantity) QuestionID from Question where (LicenseID = @LicenseID) order by newid();

		--SET VAR COUNT TO CHECK CONDITION
		set @CriticalNum = (select count(isCritical) from  Question right join @Rolled_table on QuestionID = RolledID where isCritical=1);
	end;
	

	--COUNT HOW MANY SELECTED
	declare @amount_Rolled int;
	set @amount_Rolled = (select count(*) from @Rolled_table);

	--LOOP n... TIME BASE ON @amount_Rolled
	declare @index int = 1;
	while(@index <= @amount_Rolled)
	begin
		--GET random_ID = FIRST INDEX OF RANDOMED TABLE
		declare @randomID int;
		set @randomID = (select top(1) RolledID FROM @Rolled_table);

		--INSERT QUESTION TO QUIZ BY @random_ID
        insert into Have (QuizID, QuestionID) values (@QuizID , @randomID);

		--REMOVE ID GOT FROM FIRST INDEX OF RANDOMED TABLE
        delete from @Rolled_table where RolledID = @randomID;

		--DECREASE THE LOOP TIME
		set @index = @index+1;
	end;
end;
go


--exec proc_CreateQuiz N'Đề số 2 của hạng A1','A1', 25;

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