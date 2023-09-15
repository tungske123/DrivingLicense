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
   AccountID uniqueidentifier default newid(),
   Username nvarchar(100),
   [Password] nvarchar(100),
   Role nvarchar(50),

   primary key (AccountID)
);
create table License
(
   LicenseID nvarchar(10),
   LicenseName nvarchar(100),

   primary key (LicenseID)
);

create table Vehicle
(
   VehicleID uniqueidentifier default newid(),
   Name nvarchar(100),
   Brand nvarchar(100),
   Type nvarchar(100),
   Years date,
   ContactNumber nvarchar(20),
   Address nvarchar(100),
   RentPrice decimal,
   Status bit,

   primary key (VehicleID)
);

create table Users
(
   UserID uniqueidentifier default newid(),
   AccountID uniqueidentifier default newid(),
   Avatar nvarchar(max),
   CCCD nvarchar(15),
   Email nvarchar(100),
   FullName nvarchar(100),
   BirthDate date,
   Nationality nvarchar(100),
   PhoneNumber nvarchar(20),
   Address nvarchar(100),
   Role nvarchar(20),

   primary key (UserID),
   foreign key (AccountID) references dbo.Account(AccountID)
);


create table Rent
(
   RentID uniqueidentifier default newid(),
   VehicleID uniqueidentifier default newid(),
   UserID uniqueidentifier default newid(),
   StartTime time,
   EndTime time,
   TotalRentPrice decimal,
   status nvarchar(100),

   primary key (RentID),
   foreign key (VehicleID) references dbo.Vehicle(VehicleID),
   foreign key (UserID) references dbo.Users(UserID)

);
create table Teacher
(
   TeacherID uniqueidentifier default newid(),
   AccountID uniqueidentifier default newid(),
   Name nvarchar(100),
   Information nvarchar(max),
   ContactNumber nvarchar(20),
   Email nvarchar(100),

   primary key (TeacherID),
   foreign key (AccountID) references dbo.Account(AccountID)
);

create table Schedule
(
   ScheduleID uniqueidentifier default newid(),
   TeacherID uniqueidentifier default newid(),
   UserID uniqueidentifier default newid(),
   LicenseID nvarchar(10),
   StartTime time,
   EndTime time,
   Date date,
   Price decimal,
   Address nvarchar(100),
   status nvarchar(50),

   primary key (ScheduleID),
   foreign key (TeacherID) references dbo.Teacher(TeacherID),
   foreign key (UserID) references dbo.Users(UserID),
   foreign key (LicenseID) references dbo.License(LicenseID),
);

create table Quiz
(
   QuizID nvarchar(100) not null,
   LicenseID nvarchar(10),
   [Name] nvarchar(100),
   [Description] nvarchar(max),

   primary key (QuizID),
   foreign key (LicenseID) references dbo.License(LicenseID)
);

create table Question
(
   QuestionID nvarchar(100) not null,
   QuizID nvarchar(100) not null,
   QuestionText nvarchar(max),
   QuestionImage nvarchar(max),
   isCritical bit,

   primary key (QuestionID),
   foreign key (QuizID) references Quiz(QuizID)
);

create table Answer
(
   AnswerID nvarchar(100) not null,
   QuestionID nvarchar(100) not null,
   isCorrect bit,
   AnswerText nvarchar(max),
   AnswerImage nvarchar(max),

   primary key (AnswerID),
   foreign key (QuestionID) references Question(QuestionID)
);

create table Attempt
(
   QuizID nvarchar(100) not null,
   UserID uniqueidentifier default newid(),
   Grade decimal,
   AttemptDate date,

   primary key (QuizID, UserID),
   foreign key (QuizID) references Quiz(QuizID),
   foreign key (UserID) references Users(UserID)
);
