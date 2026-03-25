namespace Bookstore.Api.Requests;

public class BookQueryParameters
{
    private const int MaxPageSize = 50;

    public int Page { get; set; } = 1;

    private int _pageSize = 5;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value <= 0 ? 5 : Math.Min(value, MaxPageSize);
    }

    public string SortBy { get; set; } = "title";
    public string SortDir { get; set; } = "asc";
    public string? Category { get; set; }
}
