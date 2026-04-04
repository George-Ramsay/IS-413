using System.ComponentModel.DataAnnotations;

namespace Bookstore.Api.Requests;

public class UpsertBookRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string Isbn { get; set; } = string.Empty;

    [Required]
    public string Classification { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int PageCount { get; set; }

    [Range(typeof(decimal), "0.01", "1000000")]
    public decimal Price { get; set; }
}
