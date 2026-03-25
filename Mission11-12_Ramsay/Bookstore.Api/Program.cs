using Bookstore.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var configuredConnectionString = builder.Configuration.GetConnectionString("BookstoreConnection");
var databasePath = Path.Combine(builder.Environment.ContentRootPath, "Data", "Bookstore.sqlite");

// Fail fast with a clear message if the course database has not been copied into the project.
if (!File.Exists(databasePath) || new FileInfo(databasePath).Length == 0)
{
    throw new InvalidOperationException(
        "The SQLite database file is missing or empty at 'Data/Bookstore.sqlite'. " +
        "Download the course database and place it at Bookstore.Api/Data/Bookstore.sqlite.");
}

var effectiveConnectionString = string.IsNullOrWhiteSpace(configuredConnectionString)
    ? $"Data Source={databasePath}"
    : configuredConnectionString.Replace("Data/Bookstore.sqlite", databasePath);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(effectiveConnectionString));

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    // The cart lives in session, so the cookie needs to persist while the user browses.
    options.Cookie.Name = ".Bookstore.Session";
    options.IdleTimeout = TimeSpan.FromHours(2);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseSession();

app.MapControllers();

app.Run();
