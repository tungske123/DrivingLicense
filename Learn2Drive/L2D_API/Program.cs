using L2D_DataAccess.Utils;
using L2D_DataAccess.Models;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using L2D_DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DrivingLicenseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DrivingLicenseDB"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder => builder.WithOrigins("http://127.0.0.1:5500")
    .AllowAnyHeader()
    .AllowAnyMethod());
    options.AddPolicy("AllowMyOrigin", builder => builder.WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod());
});
var app = builder.Build();

//// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/vehicles", async (DrivingLicenseContext _context) =>
{
    var vehicles = await _context.Vehicles
    .Select(v => new
    {
        VehicleId = v.VehicleId,
        Name = v.Name,
        Image = v.Image,
        Brand = v.Brand,
        Type = v.Type,
        Years = v.Years,
        ContactNumber = v.ContactNumber,
        Address = v.Address,
        RentPrice = v.RentPrice,
        Status = v.Status
    })
    .AsNoTracking()
    .ToListAsync();
    return vehicles;
});

app.MapGet("/api/vehicles/{id:guid}", async (DrivingLicenseContext _context, Guid id) =>
{
    var vehicle = await _context.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.VehicleId.Equals(id));
    return (vehicle is not null) ? Results.Ok(vehicle) : Results.NotFound();
});

app.MapGet("/api/users/profile/{id:guid}", async (DrivingLicenseContext _context, Guid id) =>
{
    var QuizAttemptData = await QuizRepository.Instance.GetQuizAttemptDataFromUser(id);
    var UserData = await _context.Users
    .Where(u => u.UserId.Equals(id))
    .Select(u => new
    {
        UserID = u.UserId,
        AccountID = u.AccountId,
        Avatar = u.Avatar ?? string.Empty,
        CCCD = u.Cccd ?? string.Empty,
        Email = u.Email ?? string.Empty,
        FullName = u.FullName ?? string.Empty,
        BirthDate = u.BirthDate,
        Nationality = u.Nationality ?? string.Empty,
        PhoneNumber = u.PhoneNumber ?? string.Empty,
        Address = u.Address ?? string.Empty,
        RentData = _context.Rents
        .Where(rent => rent.UserId.Equals(id))
        .Select(rent => new
        {
            RentId = rent.RentId,
            VehicleName = _context.Vehicles
            .Where(v => v.VehicleId.Equals(rent.VehicleId))
            .Select(v => v.Name).AsNoTracking().FirstOrDefault(),
            StartDate = rent.StartDate,
            EndDate = rent.EndDate,
            TotalRentPrice = rent.TotalRentPrice,
            Status = rent.Status
        })
        .ToList(),
        QuizAttemptData = QuizAttemptData
    })
    .AsNoTracking()
    .FirstOrDefaultAsync();
    if (UserData is null)
    {
        return Results.NotFound($"Can't find any users with id {id}");
    }
    return Results.Ok(UserData);
});

app.MapPut("/api/users/profile/update/{id:guid}", async (DrivingLicenseContext _context, Guid id, User userData) =>
{
    if (!userData.UserId.Equals(id))
    {
        return Results.BadRequest("The provided ID does not match the user data.");
    }
    var user = await _context.Users.AsNoTracking().SingleOrDefaultAsync(u => u.UserId.Equals(id));
    if (user is null)
    {
        return Results.NotFound();
    }
    _context.Update(userData);
    await _context.SaveChangesAsync();
    var updatedUser = await _context.Users.Where(u => u.UserId.Equals(id))
    .Select(u => new
    {
        UserID = u.UserId,
        AccountID = u.AccountId,
        Avatar = u.Avatar ?? string.Empty,
        CCCD = u.Cccd ?? string.Empty,
        Email = u.Email ?? string.Empty,
        FullName = u.FullName ?? string.Empty,
        BirthDate = u.BirthDate,
        Nationality = u.Nationality ?? string.Empty,
        PhoneNumber = u.PhoneNumber ?? string.Empty,
        Address = u.Address ?? string.Empty
    })
    .SingleOrDefaultAsync();
    return Results.Ok(updatedUser);
});
app.UseCors("AllowMyOrigin"); // use the CORS policy
app.Run();
