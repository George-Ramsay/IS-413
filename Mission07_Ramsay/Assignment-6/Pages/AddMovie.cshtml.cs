using Assignment_6.Data;
using Assignment_6.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Assignment_6.Pages;

public class AddMovieModel : PageModel
{
    private readonly MovieCollectionContext _context;

    public AddMovieModel(MovieCollectionContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Movie NewMovie { get; set; } = new();

    public List<SelectListItem> RatingOptions { get; } = new()
    {
        new SelectListItem("G", "G"),
        new SelectListItem("PG", "PG"),
        new SelectListItem("PG-13", "PG-13"),
        new SelectListItem("R", "R")
    };

    public List<SelectListItem> CategoryOptions { get; private set; } = new();

    public async Task OnGetAsync()
    {
        await LoadCategoriesAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            await LoadCategoriesAsync();
            return Page();
        }

        _context.Movies.Add(NewMovie);
        await _context.SaveChangesAsync();

        return RedirectToPage("AddMovieConfirmation");
    }

    private async Task LoadCategoriesAsync()
    {
        CategoryOptions = await _context.Categories
            .AsNoTracking()
            .OrderBy(category => category.CategoryName)
            .Select(category => new SelectListItem(category.CategoryName, category.CategoryId.ToString()))
            .ToListAsync();
    }
}
