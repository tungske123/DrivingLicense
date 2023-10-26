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
   Username nvarchar(100) unique,
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
   AccountID uniqueidentifier default newid() unique,
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
   [status] nvarchar(100),

   foreign key (VehicleID) references dbo.Vehicle(VehicleID),
   foreign key (UserID) references dbo.Users(UserID)
);

create table Teacher
(
   TeacherID uniqueidentifier default newid() primary key,
   AccountID uniqueidentifier default newid() unique,
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
   [Date] date,
   Price decimal,
   [Address] nvarchar(100),
   [status] nvarchar(50),


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

create table Staff(
	StaffID uniqueidentifier default newid() primary key,
	AccountID uniqueidentifier default newid() unique,
	FullName nvarchar(100),
	Email nvarchar(100),
	ContactNumber nvarchar(20),

   foreign key (AccountID) references dbo.Account(AccountID)
);
go

create table Administrator(
	AdministratorID uniqueidentifier default newid() primary key,
	AccountID uniqueidentifier default newid() unique,
	FullName nvarchar(100),
	Email nvarchar(100),
	ContactNumber nvarchar(20),

   foreign key (AccountID) references dbo.Account(AccountID)
);
go

create table ReportRate(
	ReportRID int identity (1,1) primary key,
	userID uniqueidentifier default newid(),
	ReportDate date,
	SenderName nvarchar(100),
	ReportTitle nvarchar(1000),
	[Description] nvarchar(4000),
	[Status] nvarchar(50)

	foreign key (userID) references dbo.Users(UserID),
);
go

create table RateReply(
	ReplyID int identity (1,1) primary key,
	reportRID int,
	userID uniqueidentifier default newid(),
	staffID uniqueidentifier default newid(),
	ReplyDate date,
	ReplierName nvarchar(100),
	[ReplyContent] nvarchar(4000)
	
	foreign key (reportRID) references dbo.ReportRate(ReportRID),
	foreign key (userID) references dbo.Users(UserID),
	foreign key (staffID) references dbo.Staff(StaffID),
);
go

create table ReportSystem(
	ReportSID int identity (1,1) primary key,
	staffID uniqueidentifier default newid(),
	ReportDate date,
	TotalExamProfile_submited int,
	TotalQuizDid int,
	TotalReportRate int

	foreign key (staffID) references dbo.Staff(StaffID)
);
go

--RESET Auto Answer ID:
dbcc checkident ('Answer', reseed, 1);

--RESET Auto Question ID:
dbcc checkident ('Question', reseed, 1);

--RESET Auto Quiz ID:
dbcc checkident ('Quiz', reseed, 1);

--RESET ReportRate ID:
dbcc checkident ('ReportRate', reseed, 1);

--RESET RateReply ID:
dbcc checkident ('RateReply', reseed, 1);

--RESET ReportSystem ID:
dbcc checkident ('ReportSystem', reseed, 1);

/*
Quan hệ 1:1 giữa hai bảng có nghĩa là
mỗi hàng trong bảng này chỉ có thể liên kết với một hàng duy nhất trong bảng kia và ngược lại.
Trong trường hợp này, mỗi giáo viên (“Teacher”) chỉ có thể có một tài khoản (“Account”) và
mỗi tài khoản chỉ thuộc về một giáo viên.

Tuy nhiên, để xác định chính xác loại quan hệ giữa hai bảng,
chúng ta cần thêm thông tin về cách các khóa này được sử dụng trong cơ sở dữ liệu.
Ví dụ, nếu “AccountID” trong bảng “Teacher” là khóa ngoại tham chiếu đến “AccountID” trong bảng “Account”,
và mỗi “AccountID” là duy nhất cho mỗi giáo viên, thì đó có thể là một quan hệ 1:1. Nhưng nếu một “AccountID”
có thể liên kết với nhiều giáo viên, thì đó sẽ là quan hệ 1:n.
*/