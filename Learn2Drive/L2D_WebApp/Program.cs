using System.Text.Json.Serialization;
using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc.Formatters;
using L2D_WebApp.Utils;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddControllers(options =>
{
    options.RespectBrowserAcceptHeader = true;
    options.InputFormatters.Insert(0, MyJPIF.GetJsonPatchInputFormatter());
});
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});
// builder.Services.AddControllers().AddJsonOptions(x =>
//                 x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

//Add connection to EntityFrameworkCore

builder.Services.AddDbContext<DrivingLicenseContext>(options =>
{
    options.UseSqlServer(configuration.GetConnectionString("DrivingLicenseDB"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder => builder.WithOrigins("http://127.0.0.1:5500")
    .AllowAnyHeader()
    .AllowAnyMethod());
    options.AddPolicy("AllowMyOrigin", builder => builder.WithOrigins("http://127.0.0.1:5502")
    .AllowAnyHeader()
    .AllowAnyMethod());
});
//Add sesssion
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);
builder.Services.AddAuthentication("Cookies").AddCookie();
////Add google authentication
//builder.Services.AddAuthentication().AddGoogle(googleOptions =>
//{
//    googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
//    googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
//});
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
//})
//.AddGoogle(options =>
//{
//    options.ClientId = configuration["Authentication:Google:ClientId"];
//    options.ClientSecret = configuration["Authentication:Google:ClientSecret"];
//    options.Scope.Add("email"); // Ensure the "email" scope is requested
//});

var app = builder.Build();
app.UseCors("AllowMyOrigin"); // use the CORS policy
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseSession();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();