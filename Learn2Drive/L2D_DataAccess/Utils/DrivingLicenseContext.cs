using System;
using System.Collections.Generic;
using L2D_DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace L2D_DataAccess.Utils;

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

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VwGetAllAccountEmail> VwGetAllAccountEmails { get; set; }

    private string GetConnectionString()
    {
        IConfiguration configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", true, true).Build();
        return configuration["ConnectionStrings:DrivingLicenseDB"];
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(GetConnectionString());

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__349DA586DC44118F");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Username, "UQ__Account__536C85E4F56B0501").IsUnique();

            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE4E821710ED0");

            entity.ToTable("Admin");

            entity.HasIndex(e => e.AccountId, "UQ__Admin__349DA587E3F17799").IsUnique();

            entity.Property(e => e.AdminId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AdminID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.AccountId)
                .HasConstraintName("FK__Admin__AccountID__4E88ABD4");
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.AnswerId).HasName("PK__Answer__D4825024324ACF98");

            entity.ToTable("Answer");

            entity.Property(e => e.AnswerId).HasColumnName("AnswerID");
            entity.Property(e => e.IsCorrect).HasColumnName("isCorrect");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer__Question__5AEE82B9");
        });

        modelBuilder.Entity<Attempt>(entity =>
        {
            entity.HasKey(e => e.AttemptId).HasName("PK__Attempt__891A6886AA1E0501");

            entity.ToTable("Attempt");

            entity.Property(e => e.AttemptId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptID");
            entity.Property(e => e.AttemptDate).HasColumnType("datetime");
            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Quiz).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attempt__QuizID__5FB337D6");

            entity.HasOne(d => d.User).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Attempt__UserID__5EBF139D");
        });

        modelBuilder.Entity<AttemptDetail>(entity =>
        {
            entity.HasKey(e => e.AttemptDetailId).HasName("PK__AttemptD__D271E13017F80399");

            entity.ToTable("AttemptDetail");

            entity.Property(e => e.AttemptDetailId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptDetailID");
            entity.Property(e => e.AttemptId).HasColumnName("AttemptID");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.SelectedAnswerId).HasColumnName("SelectedAnswerID");
            entity.Property(e => e.Status).HasMaxLength(10);

            entity.HasOne(d => d.Attempt).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.AttemptId)
                .HasConstraintName("FK__AttemptDe__Attem__6383C8BA");

            entity.HasOne(d => d.Question).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AttemptDe__Quest__6477ECF3");

            entity.HasOne(d => d.SelectedAnswer).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.SelectedAnswerId)
                .HasConstraintName("FK__AttemptDe__Selec__656C112C");
        });

        modelBuilder.Entity<ExamProfile>(entity =>
        {
            entity.HasKey(e => e.ExamProfileId).HasName("PK__ExamProf__9CEFA301FACBBDCF");

            entity.ToTable("ExamProfile");

            entity.Property(e => e.ExamProfileId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ExamProfileID");
            entity.Property(e => e.ExamDate).HasColumnType("datetime");
            entity.Property(e => e.ExamResult).HasMaxLength(100);
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.License).WithMany(p => p.ExamProfiles)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__ExamProfi__Licen__73BA3083");

            entity.HasOne(d => d.User).WithMany(p => p.ExamProfiles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ExamProfi__UserI__72C60C4A");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF68B2786E3");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("FeedbackID");
            entity.Property(e => e.FeedbackDate).HasColumnType("datetime");
            entity.Property(e => e.SenderName).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedback__Status__7F2BE32F");
        });

        modelBuilder.Entity<Hire>(entity =>
        {
            entity.HasKey(e => e.HireId).HasName("PK__Hire__FC3D8FF835C1C533");

            entity.ToTable("Hire");

            entity.Property(e => e.HireId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("HireID");
            entity.Property(e => e.HireDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TeacherId).HasColumnName("TeacherID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Hires)
                .HasForeignKey(d => d.TeacherId)
                .HasConstraintName("FK__Hire__TeacherID__693CA210");

            entity.HasOne(d => d.User).WithMany(p => p.Hires)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Hire__UserID__6A30C649");
        });

        modelBuilder.Entity<License>(entity =>
        {
            entity.HasKey(e => e.LicenseId).HasName("PK__License__72D600A2A87AF0C6");

            entity.ToTable("License");

            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.LicenseName).HasMaxLength(100);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8C9023B406");

            entity.ToTable("Question");

            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.IsCritical).HasColumnName("isCritical");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");

            entity.HasOne(d => d.License).WithMany(p => p.Questions)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Question__Licens__5441852A");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId).HasName("PK__Quiz__8B42AE6E66CCCA2A");

            entity.ToTable("Quiz");

            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.License).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Quiz__LicenseID__5165187F");

            entity.HasMany(d => d.Questions).WithMany(p => p.Quizzes)
                .UsingEntity<Dictionary<string, object>>(
                    "Have",
                    r => r.HasOne<Question>().WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuestionID__5812160E"),
                    l => l.HasOne<Quiz>().WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuizID__571DF1D5"),
                    j =>
                    {
                        j.HasKey("QuizId", "QuestionId").HasName("PK__Have__5B9EA896F53D022A");
                        j.ToTable("Have");
                        j.IndexerProperty<int>("QuizId").HasColumnName("QuizID");
                        j.IndexerProperty<int>("QuestionId").HasColumnName("QuestionID");
                    });
        });

        modelBuilder.Entity<Rent>(entity =>
        {
            entity.HasKey(e => e.RentId).HasName("PK__Rent__783D4015DE50098D");

            entity.ToTable("Rent");

            entity.Property(e => e.RentId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("RentID");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(100);
            entity.Property(e => e.TotalRentPrice).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

            entity.HasOne(d => d.User).WithMany(p => p.Rents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Rent__UserID__7B5B524B");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Rents)
                .HasForeignKey(d => d.VehicleId)
                .HasConstraintName("FK__Rent__VehicleID__7A672E12");
        });

        modelBuilder.Entity<Response>(entity =>
        {
            entity.HasKey(e => e.ResponseId).HasName("PK__Response__1AAA640CA85BFDA6");

            entity.ToTable("Response");

            entity.Property(e => e.ResponseId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ResponseID");
            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.ReplierName).HasMaxLength(100);
            entity.Property(e => e.ResponseDate).HasColumnType("datetime");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Feedback).WithMany(p => p.Responses)
                .HasForeignKey(d => d.FeedbackId)
                .HasConstraintName("FK__Response__ReplyC__02FC7413");

            entity.HasOne(d => d.Staff).WithMany(p => p.Responses)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Response__StaffI__04E4BC85");

            entity.HasOne(d => d.User).WithMany(p => p.Responses)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Response__UserID__03F0984C");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Schedule__9C8A5B6994843D95");

            entity.ToTable("Schedule");

            entity.Property(e => e.ScheduleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ScheduleID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.HireId).HasColumnName("HireID");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Hire).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.HireId)
                .HasConstraintName("FK__Schedule__HireID__6E01572D");

            entity.HasOne(d => d.License).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Schedule__Licens__6EF57B66");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF7AA456DC1");

            entity.HasIndex(e => e.AccountId, "UQ__Staff__349DA5871C412EAD").IsUnique();

            entity.Property(e => e.StaffId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("StaffID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Staff)
                .HasForeignKey<Staff>(d => d.AccountId)
                .HasConstraintName("FK__Staff__AccountID__49C3F6B7");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.TeacherId).HasName("PK__Teacher__EDF25944E2DA3F24");

            entity.ToTable("Teacher");

            entity.HasIndex(e => e.AccountId, "UQ__Teacher__349DA587FFC8EFB5").IsUnique();

            entity.Property(e => e.TeacherId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TeacherID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");

            entity.HasOne(d => d.Account).WithOne(p => p.Teacher)
                .HasForeignKey<Teacher>(d => d.AccountId)
                .HasConstraintName("FK__Teacher__Account__440B1D61");

            entity.HasOne(d => d.License).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Teacher__License__44FF419A");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC84DA6CD2");

            entity.HasIndex(e => e.AccountId, "UQ__Users__349DA587E65558FB").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
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
                .HasConstraintName("FK__Users__AccountID__3F466844");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PK__Vehicle__476B54B2C42F0450");

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
