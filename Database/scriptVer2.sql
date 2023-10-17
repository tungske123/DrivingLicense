use master;
go
if exists (select name from sys.databases where name = 'DrivingLicense')
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
   Describe nvarchar(max),
   Condition nvarchar(max),
   Cost nvarchar(max),
   [Time] nvarchar(max),
   ExamContent nvarchar(max),
   Tips nvarchar(max)
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


create table Rent
(
   RentID uniqueidentifier default newid() primary key,
   VehicleID uniqueidentifier default newid(),
   UserID uniqueidentifier default newid(),
   StartTime time,
   EndTime time,
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

--RESET Auto Answer ID:
dbcc checkident ('Answer', reseed, 1);

--RESET Auto Question ID:
dbcc checkident ('Question', reseed, 1);

--RESET Auto Quiz ID:
dbcc checkident ('Quiz', reseed, 1);