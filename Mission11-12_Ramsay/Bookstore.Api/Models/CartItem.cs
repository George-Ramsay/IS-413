namespace Bookstore.Api.Models;

public class CartItem
{
    public int BookId { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; set; }
    public decimal Subtotal => Price * Quantity;
}
