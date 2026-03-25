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
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<BookDto>>> GetBooks([FromQuery] BookQueryParameters queryParams)
    {
        var booksQuery = context.Books.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(queryParams.Category))
        {
            booksQuery = booksQuery.Where(b => b.Category == queryParams.Category);
        }

        // Support assignment sorting options while keeping results stable for duplicate values.
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
        // Clamp the page so the API still returns a valid slice if the UI requests an out-of-range page.
        var currentPage = Math.Clamp(queryParams.Page, 1, totalPages);

        var items = await booksQuery
            .Skip((currentPage - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .Select(b => new BookDto
            {
                BookId = b.BookId,
                Title = b.Title,
                Author = b.Author,
                Publisher = b.Publisher,
                Isbn = b.Isbn,
                Classification = b.Classification,
                Category = b.Category,
                PageCount = b.PageCount,
                Price = b.Price
            })
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
}
