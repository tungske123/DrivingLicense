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
   [Role] nvarchar(50),

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
   [Name] nvarchar(100),
   [Image] nvarchar(max),
   Brand nvarchar(100),
   [Type] nvarchar(100),
   Years int,
   ContactNumber nvarchar(20),
   [Address] nvarchar(100),
   RentPrice decimal,
   [Status] bit,

   primary key (VehicleID)
);

create table Users
(
   UserID uniqueidentifier default newid(),
   AccountID uniqueidentifier default newid() unique,
   Avatar nvarchar(max),
   CCCD nvarchar(15),
   Email nvarchar(100),
   FullName nvarchar(100),
   BirthDate date,
   Nationality nvarchar(100),
   PhoneNumber nvarchar(20),
   [Address] nvarchar(100),

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

   primary key (RentID, VehicleID, UserID),
   foreign key (VehicleID) references dbo.Vehicle(VehicleID),
   foreign key (UserID) references dbo.Users(UserID)
);

create table Teacher
(
   TeacherID uniqueidentifier default newid(),
   AccountID uniqueidentifier default newid() unique,
   FullName nvarchar(100),
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
   QuizID nvarchar(10) not null,
   LicenseID nvarchar(10) unique,
   [Name] nvarchar(100),
   [Description] nvarchar(max),

   primary key (QuizID),
   foreign key (LicenseID) references dbo.License(LicenseID)
);

create table Question
(
   QuestionID nvarchar(100) not null,
   QuizID nvarchar(10) not null,
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
	AttemptID nvarchar(100) not null,
	QuizID nvarchar(10) not null,
	UserID uniqueidentifier default newid(),
	Grade decimal,
	AttemptDate date,

   primary key (QuizID, UserID, AttemptID),
   foreign key (QuizID) references Quiz(QuizID),
   foreign key (UserID) references Users(UserID)
);
go

-----------------------------------[ Procedures / Functions / Triggers ]-------------------------------

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
   insert into dbo.Account (Username, [Password], [Role])
   values(@username, @password, N'Người dùng');
   declare @AccountID as nvarchar(50);
   set @AccountID = dbo.fn_GetAcountID(@username, @password);
   insert into dbo.Users(AccountID,Email)
   values(@AccountID, @email);
end;
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
go

-----------------------------------------[ INSERT VALUES ]-----------------------------------------------------
use DrivingLicense;
go
insert into Account(Username, [Password], [Role]) values
('admin' , '12345' , N'Quản trị viên'),
('manager1' , '12345' , N'Nhân viên'),
('teacher1' , '12345' , N'Giảng viên'),
('teacher2' , '12345' , N'Giảng viên'),
('teacher3' , '12345' , N'Giảng viên');

-- When insert user:
exec dbo.proc_signUpAccount @username = 'user123', @password = '123', @email = 'user123@example.com';

--=================
insert into License(LicenseID, LicenseName) values
('A1' , N'A1 - Xe máy PKN'),
('A2' , N'A2 - Xe máy PKL'),
('A3' , N'A3 - Xe máy 3 bánh'),
('A4' , N'A4 - Xe kéo dưới 1 tấn'),
('B1' , N'B1 - Xe ô tô 4-9 chỗ'),
('B2' , N'B2 - Xe ô tô 9 chỗ, dưới 3,5 tấn, được kéo rơ moóc dưới 750kg'),
('C' , N'C - Xe tải, máy kéo trên 3,5 tấn'),
('D' , N'D - Xe 10-30 chỗ'),
('E' , N'E - Xe trên 30 chỗ'),
('FB2' , N'FB2 - Xe tải nhỏ'),
('FC' , N'FC - Xe tải lớn, sơ mi rơ moóc'),
('FD' , N'FD - Xe Container nhỏ'),
('FE' , N'FE - Xe Container dài');

--=================
insert into Vehicle([Name], [Image], Brand, [Type], Years, ContactNumber, [Address], RentPrice, [Status]) values
('Wave Alpha 110cc' , 'https://truongngoainguvietnam.edu.vn/gia-xe-wave-alpha-2018-cu/imager_2_22_700.jpg' , 'Honda' , N'Xe số 110cc' , 2018 , '0123456789' , N'Quận Gò Vấp, TP.HCM' , 20000 , 1),
('Wave Alpha 110cc' , 'https://cdn.honda.com.vn/motorbike-versions/July2023/V1JxzlIUxWuk5RLW8fYF.jpg' , 'Honda' , N'Xe số 110cc' , 2023 , '0989121878' , N'Quận 2, TP.Thủ Đức' , 50000 , 1),
('Future 125 FI' , 'https://vcdn-vnexpress.vnecdn.net/2020/05/19/Honda-Future-4-8238-1589858760.jpg' , 'Honda' , N'Xe số 125cc' , 2020 , '0987654321' , N'Quận Tân Bình, TP.HCM' , 50000 , 1),
('Winner X' , 'https://vcdn-vnexpress.vnecdn.net/2021/11/12/1-5895-1636691232.jpg' , 'Honda' , N'Xe côn 150cc' , 2020 , '0334217271' , N'Quận 9, TP.Thủ Đức' , 60000 , 1),
('Sirius 110' , 'https://yamaha-motor.com.vn/wp/wp-content/uploads/2021/11/Sirius-Black-Metallic-004.png' , 'Yamaha' , N'Xe số 110cc' , 2021 , '0126623503' , N'Quận Phú Nhuận, TP.HCM' , 40000 , 1),
('Jupiter Finn 115' , 'https://images2.thanhnien.vn/Uploaded/bahung/2022_07_19/yamaha-jupiter-finn-2-1130.jpg' , 'Yamaha' , N'Xe số 115cc' , 2022 , '0786000036' , N'TP.HCM' , 40000 , 1),
('Exciter 155' , 'https://cms-i.autodaily.vn/du-lieu/2021/01/06/135678243-1276591936040046-222799997999921423-o.jpg' , 'Yamaha' , N'Xe côn 155cc' , 2023 , '0989121878' , N'Quận Phú Nhuận, TP.HCM' , 70000 , 1),
('Z1000 ABS' , 'https://images.autofun.vn/file/f91c483556bf4f9987fe8062d59a7711.png' , 'Kawasaki' , N'Xe côn 1000cc' , 2022 , '0999888999' , N'Quận 1, TP.HCM' , 111000 , 1),
('Softail Standard' , 'https://i.ytimg.com/vi/iiIuhzLJe8Y/maxresdefault.jpg' , 'Harley Davidson' , N'Xe côn 1700cc' , 2022 , '0254753345' , N'Quận 1, TP.HCM' , 120000 , 1),
('BMW R18' , 'https://media.vov.vn/sites/default/files/styles/large/public/2023-06/2a6668610b62da3c8373.jpg' , 'BMW' , N'Xe côn 1800cc' , 2020 , '0734238271' , N'Quận 7, TP.HCM' , 120000 , 1),
('CBR500R' , 'https://www.revzilla.com/blog_content_image/image/87360/redline_hero/A7303848.jpg' , 'Honda' , N'Xe côn 500cc' , 2022 , '0112278987' , N'Quận Bình Thạnh, TP.HCM' , 100000 , 1),
('YZF-R3' , 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/5-YZF_R3_2021.jpg/800px-5-YZF_R3_2021.jpg' , 'Yamaha' , N'Xe côn 300cc' , 2021 , '0909808707' , N'Quận Phú Nhuận, TP.HCM' , 85000 , 1),
('Vinfast Fadil' , 'https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_t…2019/p/g/2023/02/14/13/MF_AzRUnZCRt9rx5sNePQg.jpg' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '1900232389' , N'Quận Bình Thạnh, TP.HCM' , 200000 , 1),
('Toyota Camry' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 1' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 2' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 3' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 4' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 5' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 6' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 7' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 8' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 9' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 10' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 11' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 12' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1),
('Xe 13' , '' , 'Vinfast' ,N'Xe ô tô 5 chỗ, số tự động' , 2019 , '000000000000' , N'TP.HCM' , 200000 , 1);

--=================




-----------------------------------------[ QUERY TEST ]-----------------------------------------------------
/*
use DrivingLicense;

select * from Account;
select * from License;
select * from Vehicle;
select * from Users;


delete from Vehicle;

*/