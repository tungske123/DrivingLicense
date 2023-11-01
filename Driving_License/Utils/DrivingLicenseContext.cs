using System;
using System.Collections.Generic;
using Driving_License.Models;
using Microsoft.EntityFrameworkCore;

namespace Driving_License.Utils;

public partial class DrivingLicenseContext : DbContext
{
    public DrivingLicenseContext()
    {
    }

    public DrivingLicenseContext(DbContextOptions<DrivingLicenseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Attempt> Attempts { get; set; }

    public virtual DbSet<AttemptDetail> AttemptDetails { get; set; }

    public virtual DbSet<ExamProfile> ExamProfiles { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Hire> Hires { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<Rent> Rents { get; set; }

    public virtual DbSet<Response> Responses { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<Statistic> Statistics { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VwGetAllAccountEmail> VwGetAllAccountEmails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=(local);database=DrivingLicense;uid=sa;pwd=12345;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__349DA586C97E6F41");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Username, "UQ__Account__536C85E4D2DD1EBD").IsUnique();

            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE4E8990B241A");

            entity.ToTable("Admin");

            entity.HasIndex(e => e.AccountId, "UQ__Admin__349DA58719B71BE1").IsUnique();

            entity.Property(e => e.AdminId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AdminID");
            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.AccountId)
                .HasConstraintName("FK__Admin__AccountID__06CD04F7");
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.AnswerId).HasName("PK__Answer__D48250244F7D1ABE");

            entity.ToTable("Answer");

            entity.Property(e => e.AnswerId).HasColumnName("AnswerID");
            entity.Property(e => e.IsCorrect).HasColumnName("isCorrect");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer__Question__6EF57B66");
        });

        modelBuilder.Entity<Attempt>(entity =>
        {
            entity.HasKey(e => e.AttemptId).HasName("PK__Attempt__891A6886A436506D");

            entity.ToTable("Attempt");

            entity.Property(e => e.AttemptId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptID");
            entity.Property(e => e.AttemptDate).HasColumnType("date");
            entity.Property(e => e.Grade).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.Quiz).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attempt__QuizID__74AE54BC");

            entity.HasOne(d => d.User).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Attempt__UserID__73BA3083");
        });

        modelBuilder.Entity<AttemptDetail>(entity =>
        {
            entity.HasKey(e => e.AttemptDetailId).HasName("PK__AttemptD__D271E1306228AED1");

            entity.ToTable("AttemptDetail");

            entity.Property(e => e.AttemptDetailId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptDetailID");
            entity.Property(e => e.AttemptId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptID");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.SelectedAnswerId).HasColumnName("SelectedAnswerID");

            entity.HasOne(d => d.Attempt).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.AttemptId)
                .HasConstraintName("FK__AttemptDe__Attem__797309D9");

            entity.HasOne(d => d.Question).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AttemptDe__Quest__7A672E12");

            entity.HasOne(d => d.SelectedAnswer).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.SelectedAnswerId)
                .HasConstraintName("FK__AttemptDe__Selec__7B5B524B");
        });

        modelBuilder.Entity<ExamProfile>(entity =>
        {
            entity.HasKey(e => e.ExamProfileId).HasName("PK__ExamProf__9CEFA3015EE6DDBF");

            entity.ToTable("ExamProfile");

            entity.Property(e => e.ExamProfileId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ExamProfileID");
            entity.Property(e => e.ExamDate).HasColumnType("datetime");
            entity.Property(e => e.ExamResult).HasMaxLength(100);
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("LicenseID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.License).WithMany(p => p.ExamProfiles)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__ExamProfi__Licen__49C3F6B7");

            entity.HasOne(d => d.User).WithMany(p => p.ExamProfiles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ExamProfi__UserI__48CFD27E");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF6A853119E");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.FeedbackDate).HasColumnType("date");
            entity.Property(e => e.SenderName).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedback__Status__0A9D95DB");
        });

        modelBuilder.Entity<Hire>(entity =>
        {
            entity.HasKey(e => e.HireId).HasName("PK__Hire__FC3D8FF8FAFFC2E9");

            entity.ToTable("Hire");

            entity.Property(e => e.HireId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("HireID");
            entity.Property(e => e.HireDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TeacherId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TeacherID");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Hires)
                .HasForeignKey(d => d.TeacherId)
                .HasConstraintName("FK__Hire__TeacherID__5BE2A6F2");

            entity.HasOne(d => d.User).WithMany(p => p.Hires)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Hire__UserID__5CD6CB2B");
        });

        modelBuilder.Entity<License>(entity =>
        {
            entity.HasKey(e => e.LicenseId).HasName("PK__License__72D600A2458EF3CA");

            entity.ToTable("License");

            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.LicenseName).HasMaxLength(100);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8CE9AE4A0F");

            entity.ToTable("Question");

            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.IsCritical).HasColumnName("isCritical");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");

            entity.HasOne(d => d.License).WithMany(p => p.Questions)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Question__Licens__68487DD7");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId).HasName("PK__Quiz__8B42AE6E574E23BC");

            entity.ToTable("Quiz");

            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.License).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Quiz__LicenseID__656C112C");

            entity.HasMany(d => d.Questions).WithMany(p => p.Quizzes)
                .UsingEntity<Dictionary<string, object>>(
                    "Have",
                    r => r.HasOne<Question>().WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuestionID__6C190EBB"),
                    l => l.HasOne<Quiz>().WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuizID__6B24EA82"),
                    j =>
                    {
                        j.HasKey("QuizId", "QuestionId").HasName("PK__Have__5B9EA8962DDE167C");
                        j.ToTable("Have");
                        j.IndexerProperty<int>("QuizId").HasColumnName("QuizID");
                        j.IndexerProperty<int>("QuestionId").HasColumnName("QuestionID");
                    });
        });

        modelBuilder.Entity<Rent>(entity =>
        {
            entity.HasKey(e => e.RentId).HasName("PK__Rent__783D4015EEAEE98C");

            entity.ToTable("Rent");

            entity.Property(e => e.RentId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("RentID");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(100);
            entity.Property(e => e.TotalRentPrice).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");
            entity.Property(e => e.VehicleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("VehicleID");

            entity.HasOne(d => d.User).WithMany(p => p.Rents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Rent__UserID__5070F446");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Rents)
                .HasForeignKey(d => d.VehicleId)
                .HasConstraintName("FK__Rent__VehicleID__4F7CD00D");
        });

        modelBuilder.Entity<Response>(entity =>
        {
            entity.HasKey(e => e.ResponseId).HasName("PK__Response__1AAA640CCB75FA5B");

            entity.ToTable("Response");

            entity.Property(e => e.ResponseId).HasColumnName("ResponseID");
            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.ReplierName).HasMaxLength(100);
            entity.Property(e => e.ResponseDate).HasColumnType("date");
            entity.Property(e => e.StaffId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("StaffID");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.Feedback).WithMany(p => p.Responses)
                .HasForeignKey(d => d.FeedbackId)
                .HasConstraintName("FK__Response__ReplyC__0F624AF8");

            entity.HasOne(d => d.Staff).WithMany(p => p.Responses)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Response__StaffI__114A936A");

            entity.HasOne(d => d.User).WithMany(p => p.Responses)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Response__UserID__10566F31");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Schedule__9C8A5B69F0DE56DF");

            entity.ToTable("Schedule");

            entity.Property(e => e.ScheduleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ScheduleID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.HireId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("HireID");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Hire).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.HireId)
                .HasConstraintName("FK__Schedule__HireID__619B8048");

            entity.HasOne(d => d.License).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Schedule__Licens__628FA481");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF770F25F25");

            entity.HasIndex(e => e.AccountId, "UQ__Staff__349DA5873220EE59").IsUnique();

            entity.Property(e => e.StaffId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("StaffID");
            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Staff)
                .HasForeignKey<Staff>(d => d.AccountId)
                .HasConstraintName("FK__Staff__AccountID__01142BA1");
        });

        modelBuilder.Entity<Statistic>(entity =>
        {
            entity.HasKey(e => e.StatisticId).HasName("PK__Statisti__367DEB3700A03940");

            entity.ToTable("Statistic");

            entity.Property(e => e.StatisticId).HasColumnName("StatisticID");
            entity.Property(e => e.StaffId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("StaffID");
            entity.Property(e => e.StatisticDate).HasColumnType("datetime");

            entity.HasOne(d => d.Staff).WithMany(p => p.Statistics)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Statistic__Total__151B244E");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.TeacherId).HasName("PK__Teacher__EDF2594437129421");

            entity.ToTable("Teacher");

            entity.HasIndex(e => e.AccountId, "UQ__Teacher__349DA587AD4C8C19").IsUnique();

            entity.Property(e => e.TeacherId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TeacherID");
            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Teacher)
                .HasForeignKey<Teacher>(d => d.AccountId)
                .HasConstraintName("FK__Teacher__Account__5629CD9C");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC85B284B9");

            entity.HasIndex(e => e.AccountId, "UQ__Users__349DA5874C50B9CC").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");
            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.BirthDate).HasColumnType("date");
            entity.Property(e => e.Cccd)
                .HasMaxLength(15)
                .HasColumnName("CCCD");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Nationality).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);

            entity.HasOne(d => d.Account).WithOne(p => p.User)
                .HasForeignKey<User>(d => d.AccountId)
                .HasConstraintName("FK__Users__AccountID__4316F928");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PK__Vehicle__476B54B21E6003A4");

            entity.ToTable("Vehicle");

            entity.Property(e => e.VehicleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("VehicleID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Brand).HasMaxLength(100);
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.RentPrice).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Type).HasMaxLength(100);
        });

        modelBuilder.Entity<VwGetAllAccountEmail>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_getAllAccountEmails");

            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(7)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
