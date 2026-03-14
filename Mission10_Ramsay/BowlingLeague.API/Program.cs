using BowlingLeague.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var databasePath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "BowlingLeague.sqlite"));
builder.Services.AddDbContext<BowlingLeagueContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ReactClient");

app.MapControllers();

app.Run();
