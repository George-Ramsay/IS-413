namespace Bookstore.Api.Dtos;

public class BookDto
{
    public int BookId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Author { get; init; } = string.Empty;
    public string Publisher { get; init; } = string.Empty;
    public string Isbn { get; init; } = string.Empty;
    public string Classification { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public int PageCount { get; init; }
    public decimal Price { get; init; }
}
