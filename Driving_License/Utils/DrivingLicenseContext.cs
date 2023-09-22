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

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Attempt> Attempts { get; set; }

    public virtual DbSet<AttemptDetail> AttemptDetails { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<Rent> Rents { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VwGetAllAccountEmail> VwGetAllAccountEmails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DrivingLicenseDB");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__349DA58668E9BC00");

            entity.ToTable("Account");

            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.AnswerId).HasName("PK__Answer__D48250247D6C210F");

            entity.ToTable("Answer");

            entity.Property(e => e.AnswerId).HasColumnName("AnswerID");
            entity.Property(e => e.IsCorrect).HasColumnName("isCorrect");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer__Question__60A75C0F");
        });

        modelBuilder.Entity<Attempt>(entity =>
        {
            entity.HasKey(e => e.AttemptId).HasName("PK__Attempt__891A68861C5D2EB6");

            entity.ToTable("Attempt");

            entity.Property(e => e.AttemptId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptID");
            entity.Property(e => e.AttemptDate).HasColumnType("date");
            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.Quiz).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attempt__QuizID__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.Attempts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Attempt__UserID__656C112C");
        });

        modelBuilder.Entity<AttemptDetail>(entity =>
        {
            entity.HasKey(e => e.AttemptDetailId).HasName("PK__AttemptD__D271E130F3C29764");

            entity.ToTable("AttemptDetail");

            entity.Property(e => e.AttemptDetailId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AttemptDetailID");
            entity.Property(e => e.AttemptId).HasColumnName("AttemptID");
            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.SelectedAnswerId).HasColumnName("SelectedAnswerID");

            entity.HasOne(d => d.Attempt).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.AttemptId)
                .HasConstraintName("FK__AttemptDe__Attem__6A30C649");

            entity.HasOne(d => d.Question).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AttemptDe__Quest__6B24EA82");

            entity.HasOne(d => d.SelectedAnswer).WithMany(p => p.AttemptDetails)
                .HasForeignKey(d => d.SelectedAnswerId)
                .HasConstraintName("FK__AttemptDe__Selec__6C190EBB");
        });

        modelBuilder.Entity<License>(entity =>
        {
            entity.HasKey(e => e.LicenseId).HasName("PK__License__72D600A2475EC47A");

            entity.ToTable("License");

            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.LicenseName).HasMaxLength(100);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8CA72AF989");

            entity.ToTable("Question");

            entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
            entity.Property(e => e.IsCritical).HasColumnName("isCritical");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");

            entity.HasOne(d => d.License).WithMany(p => p.Questions)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Question__Licens__59FA5E80");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId).HasName("PK__Quiz__8B42AE6EF1B394B6");

            entity.ToTable("Quiz");

            entity.Property(e => e.QuizId).HasColumnName("QuizID");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.License).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Quiz__LicenseID__571DF1D5");

            entity.HasMany(d => d.Questions).WithMany(p => p.Quizzes)
                .UsingEntity<Dictionary<string, object>>(
                    "Have",
                    r => r.HasOne<Question>().WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuestionID__5DCAEF64"),
                    l => l.HasOne<Quiz>().WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Have__QuizID__5CD6CB2B"),
                    j =>
                    {
                        j.HasKey("QuizId", "QuestionId").HasName("PK__Have__5B9EA8963869877B");
                        j.ToTable("Have");
                        j.IndexerProperty<int>("QuizId").HasColumnName("QuizID");
                        j.IndexerProperty<int>("QuestionId").HasColumnName("QuestionID");
                    });
        });

        modelBuilder.Entity<Rent>(entity =>
        {
            entity.HasKey(e => e.RentId).HasName("PK__Rent__783D4015200FF916");

            entity.ToTable("Rent");

            entity.Property(e => e.RentId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("RentID");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .HasColumnName("status");
            entity.Property(e => e.TotalRentPrice).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");
            entity.Property(e => e.VehicleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("VehicleID");

            entity.HasOne(d => d.User).WithMany(p => p.Rents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Rent__UserID__47DBAE45");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Rents)
                .HasForeignKey(d => d.VehicleId)
                .HasConstraintName("FK__Rent__VehicleID__46E78A0C");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Schedule__9C8A5B6901F1BB37");

            entity.ToTable("Schedule");

            entity.Property(e => e.ScheduleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ScheduleID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.LicenseId)
                .HasMaxLength(10)
                .HasColumnName("LicenseID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
            entity.Property(e => e.TeacherId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TeacherID");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");

            entity.HasOne(d => d.License).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.LicenseId)
                .HasConstraintName("FK__Schedule__Licens__5441852A");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.TeacherId)
                .HasConstraintName("FK__Schedule__Teache__52593CB8");

            entity.HasOne(d => d.User).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Schedule__UserID__534D60F1");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.TeacherId).HasName("PK__Teacher__EDF2594434921FB2");

            entity.ToTable("Teacher");

            entity.Property(e => e.TeacherId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TeacherID");
            entity.Property(e => e.AccountId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("AccountID");
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__Teacher__Account__4CA06362");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC4060F2A6");

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

            entity.HasOne(d => d.Account).WithMany(p => p.Users)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__Users__AccountID__412EB0B6");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PK__Vehicle__476B54B2370385F7");

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
