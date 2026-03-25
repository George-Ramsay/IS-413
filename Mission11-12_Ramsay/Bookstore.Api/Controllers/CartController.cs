using Bookstore.Api.Data;
using Bookstore.Api.Dtos;
using Bookstore.Api.Extensions;
using Bookstore.Api.Models;
using Bookstore.Api.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController(BookstoreContext context) : ControllerBase
{
    private const string CartSessionKey = "bookstore-cart";

    [HttpGet]
    public ActionResult<CartSummaryDto> GetCart()
    {
        return Ok(BuildSummary(GetCartItems()));
    }

    [HttpPost]
    public async Task<ActionResult<CartSummaryDto>> AddToCart([FromBody] AddToCartRequest request)
    {
        var book = await context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.BookId == request.BookId);
        if (book is null)
        {
            return NotFound($"Book with ID {request.BookId} was not found.");
        }

        var cartItems = GetCartItems();
        var existingItem = cartItems.FirstOrDefault(i => i.BookId == request.BookId);

        // Adding the same title again increases quantity instead of duplicating rows in the cart.
        if (existingItem is null)
        {
            cartItems.Add(new CartItem
            {
                BookId = book.BookId,
                Title = book.Title,
                Price = book.Price,
                Quantity = request.Quantity
            });
        }
        else
        {
            existingItem.Quantity += request.Quantity;
        }

        SaveCartItems(cartItems);
        return Ok(BuildSummary(cartItems));
    }

    [HttpPut]
    public ActionResult<CartSummaryDto> UpdateCartItem([FromBody] UpdateCartItemRequest request)
    {
        var cartItems = GetCartItems();
        var existingItem = cartItems.FirstOrDefault(i => i.BookId == request.BookId);

        if (existingItem is null)
        {
            return NotFound($"Cart item with Book ID {request.BookId} was not found.");
        }

        if (request.Quantity <= 0)
        {
            cartItems.Remove(existingItem);
        }
        else
        {
            existingItem.Quantity = request.Quantity;
        }

        SaveCartItems(cartItems);
        return Ok(BuildSummary(cartItems));
    }

    [HttpDelete("{bookId:int}")]
    public ActionResult<CartSummaryDto> RemoveFromCart(int bookId)
    {
        var cartItems = GetCartItems();
        var existingItem = cartItems.FirstOrDefault(i => i.BookId == bookId);

        if (existingItem is null)
        {
            return NotFound($"Cart item with Book ID {bookId} was not found.");
        }

        cartItems.Remove(existingItem);
        SaveCartItems(cartItems);
        return Ok(BuildSummary(cartItems));
    }

    [HttpDelete]
    public ActionResult<CartSummaryDto> ClearCart()
    {
        SaveCartItems([]);
        return Ok(BuildSummary([]));
    }

    private List<CartItem> GetCartItems()
    {
        // Session stores strings, so cart contents are serialized/deserialized through the helper methods.
        return HttpContext.Session.GetObject<List<CartItem>>(CartSessionKey) ?? [];
    }

    private void SaveCartItems(List<CartItem> items)
    {
        HttpContext.Session.SetObject(CartSessionKey, items);
    }

    private static CartSummaryDto BuildSummary(IReadOnlyList<CartItem> items)
    {
        // The UI reads precomputed subtotals and totals directly from this DTO.
        return new CartSummaryDto
        {
            Items = items
                .Select(i => new CartItemDto
                {
                    BookId = i.BookId,
                    Title = i.Title,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    Subtotal = i.Subtotal
                })
                .ToList(),
            TotalQuantity = items.Sum(i => i.Quantity),
            TotalPrice = items.Sum(i => i.Subtotal)
        };
    }
}
