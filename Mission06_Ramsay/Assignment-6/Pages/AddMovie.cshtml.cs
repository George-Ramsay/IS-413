using Assignment_6.Data;
using Assignment_6.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

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

    public void OnGet()
    {
    }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        _context.Movies.Add(NewMovie);
        _context.SaveChanges();

        return RedirectToPage("AddMovieConfirmation");
    }
}
