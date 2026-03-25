using System.ComponentModel.DataAnnotations;

namespace Bookstore.Api.Requests;

public class AddToCartRequest
{
    [Range(1, int.MaxValue)]
    public int BookId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemRequest
{
    [Range(1, int.MaxValue)]
    public int BookId { get; set; }

    [Range(0, 100)]
    public int Quantity { get; set; }
}
