use master;
go
create database DrivingLicense;
go
use DrivingLicense;

create table Users (

   --Fields
   UserID nvarchar(15) not null,
   Avatar nvarchar(max),
   Username nvarchar(100),
   FullName nvarchar(100),
   BirthDate date,
   Nationality nvarchar(100),
   [Address] nvarchar(100),
   [Role] nvarchar(20)

   --Keys
   primary key (UserID)
);


create table Quiz (
   -- Fields
   QuizID nvarchar(100) not null,
   [Name] nvarchar(100),
   [Description] nvarchar(max),
   LicenseType nvarchar(100)

   -- Keys
   primary key (QuizID)
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
   AnswerText nvarchar(max)

   --Keys
   primary key (AnswerID)
   foreign key (QuestionID) references Question(QuestionID)
);

create table Attempt(

  -- Fields
  QuizID nvarchar(100) not null,
  UserID nvarchar(15) not null,
  Grade decimal,
  AttemptDate date

  -- Keys
  primary key (QuizID),
  foreign key (QuizID) references Quiz(QuizID),
  foreign key (UserID) references Users(UserID)
);

