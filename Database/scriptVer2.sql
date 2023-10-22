use master;
go
if exists (select name
from sys.databases
where name = 'DrivingLicense')
begin
   drop database DrivingLicense;
end;
go
create database DrivingLicense;
go
use DrivingLicense;



create table Account
(
   AccountID uniqueidentifier default newid() primary key,
   Username nvarchar(100),
   [Password] nvarchar(100),
   [Role] nvarchar(50),
);
create table License
(
   LicenseID nvarchar(10) primary key,
   LicenseName nvarchar(100),
);

create table Vehicle
(
   VehicleID uniqueidentifier default newid() primary key,
   [Name] nvarchar(100),
   [Image] nvarchar(max),
   Brand nvarchar(100),
   [Type] nvarchar(100),
   Years int,
   ContactNumber nvarchar(20),
   [Address] nvarchar(100),
   RentPrice decimal,
   [Status] bit,
   [Description] nvarchar(max)
);

create table Users
(
   UserID uniqueidentifier default newid() primary key,
   AccountID uniqueidentifier default newid(),
   Avatar nvarchar(max),
   CCCD nvarchar(15),
   Email nvarchar(100),
   FullName nvarchar(100),
   BirthDate date,
   Nationality nvarchar(100),
   PhoneNumber nvarchar(20),
   [Address] nvarchar(100),
   foreign key (AccountID) references dbo.Account(AccountID)
);

create table Records
(
	UserID uniqueidentifier default newid(),
	LicenseID nvarchar(10),
	TestDate DATETIME,
	TestResult nvarchar(50),
	Physical_Condition nvarchar(100),
	foreign key (UserID) references dbo.Users(UserID),
	foreign key (LicenseID) references dbo.License(LicenseID),
	PRIMARY KEY (UserID, LicenseID)
);


create table Rent
(
   RentID uniqueidentifier default newid() primary key,
   VehicleID uniqueidentifier default newid(),
   UserID uniqueidentifier default newid(),
   StartDate datetime,
   EndDate datetime,
   TotalRentPrice decimal,
   status nvarchar(100),

   foreign key (VehicleID) references dbo.Vehicle(VehicleID),
   foreign key (UserID) references dbo.Users(UserID)
);

create table Teacher
(
   TeacherID uniqueidentifier default newid() primary key,
   AccountID uniqueidentifier default newid(),
   FullName nvarchar(100),
   Information nvarchar(max),
   ContactNumber nvarchar(20),
   Email nvarchar(100),

   foreign key (AccountID) references dbo.Account(AccountID)
);

create table Schedule
(
   ScheduleID uniqueidentifier default newid() primary key,
   TeacherID uniqueidentifier default newid(),
   UserID uniqueidentifier default newid(),
   LicenseID nvarchar(10),
   StartTime time,
   EndTime time,
   Date date,
   Price decimal,
   Address nvarchar(100),
   status nvarchar(50),


   foreign key (TeacherID) references dbo.Teacher(TeacherID),
   foreign key (UserID) references dbo.Users(UserID),
   foreign key (LicenseID) references dbo.License(LicenseID),
);

create table Quiz
(
   QuizID int identity(1,1) primary key,
   LicenseID nvarchar(10),
   [Name] nvarchar(100),
   [Description] nvarchar(max),


   foreign key (LicenseID) references dbo.License(LicenseID)
);

create table Question
(
   QuestionID int identity (1,1) primary key,
   LicenseID nvarchar(10),
   QuestionText nvarchar(max),
   QuestionImage nvarchar(max),
   isCritical bit,

   foreign key (LicenseID) references License(LicenseID),
);

create table Have(
   QuizID int not null,
   QuestionID int not null,

   primary key (QuizID, QuestionID),
   foreign key (QuizID) references dbo.Quiz(QuizID),
   foreign key (QuestionID) references dbo.Question(QuestionID)
);

create table Answer
(
   AnswerID int identity(1,1) primary key,
   QuestionID int not null,
   isCorrect bit,
   AnswerText nvarchar(max),
   AnswerImage nvarchar(max),

   foreign key (QuestionID) references Question(QuestionID)
);

create table Attempt (
    AttemptID uniqueidentifier default newid() primary key,
	UserID uniqueidentifier default newid(),
	QuizID int not null,
	AttemptDate date,
	Grade decimal,

	foreign key (UserID) references dbo.Users(UserID),
	foreign key (QuizID) references dbo.Quiz(QuizID)
);
create table AttemptDetail (
   AttemptDetailID uniqueidentifier default newid() primary key,
   AttemptID uniqueidentifier,
   QuestionID int not null,
   SelectedAnswerID int null,
   IsCorrect bit,

   foreign key (AttemptID) references dbo.Attempt(AttemptID),
   foreign key (QuestionID) references dbo.Question(QuestionID),
   foreign key (SelectedAnswerID) references dbo.Answer(AnswerID),

);
go

-----------------------------------[ Procedures / Functions / Triggers / Views ]-------------------------------------

create or alter function fn_GetAcountID (@username nvarchar(100), @password nvarchar(100))
returns nvarchar(50)
as
begin
   declare @AccountID as nvarchar(50);
   select @AccountID = convert(nvarchar(50), AccountID)
   from dbo.Account
   where Username = @username and Password = @password;
   return @AccountID;
end;
go

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
/*------------------------------------------
create or alter procedure proc_changeRole @accountID nvarchar(50), @fullname nvarchar(100), @email nvarchar(100), @roleNew nvarchar(50)
as
begin
	declare @roleOld nvarchar(50);
	set @roleOld = (select [Role] from dbo.Account where AccountID = @accountID
	
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
