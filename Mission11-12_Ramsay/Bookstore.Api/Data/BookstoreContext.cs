using Bookstore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Data;

public class BookstoreContext(DbContextOptions<BookstoreContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().ToTable("Books");

        modelBuilder.Entity<Book>()
            .Property(b => b.Price)
            .HasPrecision(10, 2);

        base.OnModelCreating(modelBuilder);
    }
}
