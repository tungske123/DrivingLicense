use master;
go
create database DrivingLicense;
go
use DrivingLicense;

create table Users (

   --Fields
   UserID uniqueidentifier default newid(),
   Avatar nvarchar(max),
   CCCD nvarchar(15),
   Email nvarchar(100),
   Username nvarchar(100),
   [Password] nvarchar(100),
   FullName nvarchar(100),
   BirthDate date,
   Nationality nvarchar(100),
   PhoneNumber nvarchar(20),
   [Address] nvarchar(100),
   [Role] nvarchar(20),
   --Keys
   primary key (UserID)
);

create table License (
   -- Fields
   LicenseID nvarchar(10) not null,
   LicenseName nvarchar(100),

   -- Keys
   primary key (LicenseID)
);

create table Quiz (
   -- Fields
   QuizID nvarchar(100) not null,
   LicenseID nvarchar(10) not null,
   [Name] nvarchar(100),
   [Description] nvarchar(max),
   QuizImage nvarchar(max),

   -- Keys
   primary key (QuizID),
   foreign key (LicenseID) references dbo.License(LicenseID)
);

create table Question(
   --Fields
   QuestionID nvarchar(100) not null,
   QuizID nvarchar(100) not null,
   QuestionText nvarchar(max)

   -- Keys
   primary key (QuestionID),
   foreign key (QuizID) references Quiz(QuizID)
);

create table Answer(

   --Fields
   AnswerID nvarchar(100) not null,
   QuestionID nvarchar(100) not null,
   isCorrect bit,
   AnswerText nvarchar(max),
   AnswerImage nvarchar(max),

   --Keys
   primary key (AnswerID),
   foreign key (QuestionID) references Question(QuestionID)
);

create table Attempt(

  -- Fields
  QuizID nvarchar(100) not null,
  UserID uniqueidentifier default newid(),
  Grade decimal,
  AttemptDate date

  -- Keys
  primary key (QuizID),
  foreign key (QuizID) references Quiz(QuizID),
  foreign key (UserID) references Users(UserID)
);

----------------------------------------------------------------------------------------------------------------------
