namespace Bookstore.Api.Dtos;

public class CartSummaryDto
{
    public IReadOnlyList<CartItemDto> Items { get; init; } = [];
    public int TotalQuantity { get; init; }
    public decimal TotalPrice { get; init; }
}

public class CartItemDto
{
    public int BookId { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public decimal Subtotal { get; init; }
}
