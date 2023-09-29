use DrivingLicense;
-----------------------------------[ CREATE ACCOUNT USER ]-------------------------------
go
create or alter function fn_GetAccountID (@username nvarchar(100), @password nvarchar(100))
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
-----------------------------------[ ADD ATTEMPT ]-------------------------------
/*
create or alter function fn_NewAttempt (
returns int
as 
begin

end;
go

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

*/

-----------------------------------[ CALCULATE MONEY / TIME ]-------------------------------
/*
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
*/
/*
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
	/* CÁCH 1
	declare @userid as nvarchar(50);
	set @userid = dbo.fn_GetUserID(@mailUser, @nameUser);

	declare @teacherid as nvarchar(50);
	set @teacherid = dbo.fn_GetTeacherID(@mailGV, @nameGV);
	*/
	
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

-----------------------------------[ CHANGE ROLE ]-------------------------------
/*
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
CREATE OR ALTER     procedure [dbo].[proc_CalculateQuizResult] @AttemptID uniqueidentifier
as
declare @CorrectQuestionCnt as int;
declare @IncorrectQuestionCnt as int;
declare @TotalQuestionCnt as int;
declare @QuizID as int;
declare @Result as decimal(18, 2);
declare @RemainingQuestion as int;
declare @AttemptDate as date;
set @AttemptDate = (select AttemptDate from dbo.Attempt where AttemptID = @AttemptID);
set @QuizID = (select QuizID from dbo.Attempt where AttemptID = @AttemptID);
set @CorrectQuestionCnt = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and IsCorrect = 1);
set @IncorrectQuestionCnt = (select count(*) from dbo.AttemptDetail where AttemptID = @AttemptID and IsCorrect = 0);
set @TotalQuestionCnt = (select count(*) from dbo.Have where QuizID = @QuizID);
set @Result = cast(@CorrectQuestionCnt as decimal(18, 2)) / cast(@TotalQuestionCnt as decimal(18, 2)) * 100.0;
set @RemainingQuestion = @TotalQuestionCnt - @CorrectQuestionCnt - @IncorrectQuestionCnt;
select (select [Name] from dbo.Quiz where QuizID = @QuizID) as 'QuizName', 
(select LicenseID from dbo.Quiz where QuizID = @QuizID) as 'License',
@AttemptDate as 'AttemptDate',
@TotalQuestionCnt as 'TotalQuestion',
@CorrectQuestionCnt as 'CorrectQuestion', @IncorrectQuestionCnt as 'IncorrectQuestion', 
@RemainingQuestion as 'RemainingQuestion',
@Result as 'Result'
from dbo.AttemptDetail att
where att.AttemptID = @AttemptID
group by att.AttemptID;
update dbo.Attempt
set Grade = cast(@Result as decimal(18, 2))
where AttemptID = @AttemptID;
go

GO
CREATE OR ALTER   PROCEDURE [dbo].[proc_GetQuizAttempStats] @AttemptID uniqueidentifier
AS
BEGIN
    SELECT
        q.QuestionText,
        CASE
            WHEN att.SelectedAnswerID IS NOT NULL THEN (SELECT AnswerText FROM dbo.Answer WHERE AnswerID = att.SelectedAnswerID)
            ELSE NULL -- UserAnswer is NULL for questions without user answers
        END AS 'UserAnswer',
        (SELECT a.AnswerText FROM dbo.Answer a WHERE a.QuestionID = q.QuestionID AND a.isCorrect = 1) AS 'CorrectAnswer',
        CASE
            WHEN att.SelectedAnswerID IS NULL THEN 0 -- Set IsCorrect to 0 for questions without user answers
            ELSE att.IsCorrect
        END AS 'IsCorrect'
    FROM
        dbo.Question q
    LEFT JOIN
        dbo.AttemptDetail att ON q.QuestionID = att.QuestionID AND att.AttemptID = @AttemptID
    WHERE
        q.QuestionID IN (
            SELECT QuestionID
            FROM dbo.Have
            WHERE QuizID = (SELECT QuizID FROM dbo.Attempt WHERE AttemptID = @AttemptID)
        );
END
GO