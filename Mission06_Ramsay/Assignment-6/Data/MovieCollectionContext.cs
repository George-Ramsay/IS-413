using Assignment_6.Models;
using Microsoft.EntityFrameworkCore;

namespace Assignment_6.Data;

public class MovieCollectionContext : DbContext
{
    public MovieCollectionContext(DbContextOptions<MovieCollectionContext> options) : base(options)
    {
    }

    public DbSet<Movie> Movies => Set<Movie>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Movie>().HasData(
            new Movie
            {
                MovieId = 1,
                Title = "Inception",
                Category = "Sci-Fi",
                Year = 2010,
                Director = "Christopher Nolan",
                Rating = "PG-13",
                Edited = false
            },
            new Movie
            {
                MovieId = 2,
                Title = "The Lord of the Rings: The Fellowship of the Ring",
                Category = "Fantasy",
                Year = 2001,
                Director = "Peter Jackson",
                Rating = "PG-13",
                Edited = false
            },
            new Movie
            {
                MovieId = 3,
                Title = "Pride & Prejudice",
                Category = "Drama",
                Year = 2005,
                Director = "Joe Wright",
                Rating = "PG",
                Edited = false
            });
    }
}
