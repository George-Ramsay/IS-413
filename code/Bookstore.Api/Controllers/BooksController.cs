using Bookstore.Api.Data;
using Bookstore.Api.Dtos;
using Bookstore.Api.Models;
using Bookstore.Api.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyList<BookDto>>> GetAllBooks()
    {
        var books = await context.Books
            .AsNoTracking()
            .OrderBy(b => b.Title)
            .ThenBy(b => b.BookId)
            .Select(ToDtoExpression())
            .ToListAsync();

        return Ok(books);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<BookDto>>> GetBooks([FromQuery] BookQueryParameters queryParams)
    {
        var booksQuery = context.Books.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(queryParams.Category))
        {
            booksQuery = booksQuery.Where(b => b.Category == queryParams.Category);
        }

        var sortBy = queryParams.SortBy.ToLowerInvariant();
        var descending = queryParams.SortDir.Equals("desc", StringComparison.OrdinalIgnoreCase);

        booksQuery = sortBy switch
        {
            "title" => descending
                ? booksQuery.OrderByDescending(b => b.Title).ThenBy(b => b.BookId)
                : booksQuery.OrderBy(b => b.Title).ThenBy(b => b.BookId),
            "price" => descending
                ? booksQuery.OrderByDescending(b => b.Price).ThenBy(b => b.BookId)
                : booksQuery.OrderBy(b => b.Price).ThenBy(b => b.BookId),
            _ => descending
                ? booksQuery.OrderByDescending(b => b.Title).ThenBy(b => b.BookId)
                : booksQuery.OrderBy(b => b.Title).ThenBy(b => b.BookId)
        };

        var totalCount = await booksQuery.CountAsync();
        var totalPages = totalCount == 0 ? 1 : (int)Math.Ceiling(totalCount / (double)queryParams.PageSize);
        var currentPage = Math.Clamp(queryParams.Page, 1, totalPages);

        var items = await booksQuery
            .Skip((currentPage - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .Select(ToDtoExpression())
            .ToListAsync();

        return Ok(new PagedResultDto<BookDto>
        {
            Items = items,
            TotalCount = totalCount,
            CurrentPage = currentPage,
            PageSize = queryParams.PageSize,
            TotalPages = totalPages
        });
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCategories()
    {
        var categories = await context.Books
            .AsNoTracking()
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookDto>> GetBook(int id)
    {
        var book = await context.Books
            .AsNoTracking()
            .Where(b => b.BookId == id)
            .Select(ToDtoExpression())
            .FirstOrDefaultAsync();

        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> CreateBook([FromBody] UpsertBookRequest request)
    {
        var book = new Book();
        ApplyBookChanges(book, request);

        context.Books.Add(book);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, ToDto(book));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<BookDto>> UpdateBook(int id, [FromBody] UpsertBookRequest request)
    {
        var book = await context.Books.FindAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        ApplyBookChanges(book, request);
        await context.SaveChangesAsync();

        return Ok(ToDto(book));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        context.Books.Remove(book);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static void ApplyBookChanges(Book book, UpsertBookRequest request)
    {
        book.Title = request.Title.Trim();
        book.Author = request.Author.Trim();
        book.Publisher = request.Publisher.Trim();
        book.Isbn = request.Isbn.Trim();
        book.Classification = request.Classification.Trim();
        book.Category = request.Category.Trim();
        book.PageCount = request.PageCount;
        book.Price = request.Price;
    }

    private static BookDto ToDto(Book book) =>
        new()
        {
            BookId = book.BookId,
            Title = book.Title,
            Author = book.Author,
            Publisher = book.Publisher,
            Isbn = book.Isbn,
            Classification = book.Classification,
            Category = book.Category,
            PageCount = book.PageCount,
            Price = book.Price
        };

    private static System.Linq.Expressions.Expression<Func<Book, BookDto>> ToDtoExpression() =>
        book => new BookDto
        {
            BookId = book.BookId,
            Title = book.Title,
            Author = book.Author,
            Publisher = book.Publisher,
            Isbn = book.Isbn,
            Classification = book.Classification,
            Category = book.Category,
            PageCount = book.PageCount,
            Price = book.Price
        };
}
