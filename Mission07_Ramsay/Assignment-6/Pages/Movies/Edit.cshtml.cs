using Assignment_6.Data;
using Assignment_6.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Assignment_6.Pages.Movies;

public class EditModel : PageModel
{
    private readonly MovieCollectionContext _context;

    public EditModel(MovieCollectionContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Movie Movie { get; set; } = new();

    public List<SelectListItem> RatingOptions { get; } = new()
    {
        new SelectListItem("G", "G"),
        new SelectListItem("PG", "PG"),
        new SelectListItem("PG-13", "PG-13"),
        new SelectListItem("R", "R")
    };

    public List<SelectListItem> CategoryOptions { get; private set; } = new();

    public async Task<IActionResult> OnGetAsync(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }

        Movie = movie;
        await LoadCategoriesAsync();
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            await LoadCategoriesAsync();
            return Page();
        }

        var movieInDb = await _context.Movies.FindAsync(Movie.MovieId);
        if (movieInDb == null)
        {
            return NotFound();
        }

        movieInDb.Title = Movie.Title;
        movieInDb.CategoryId = Movie.CategoryId;
        movieInDb.Year = Movie.Year;
        movieInDb.Director = Movie.Director;
        movieInDb.Rating = Movie.Rating;
        movieInDb.Edited = Movie.Edited;
        movieInDb.CopiedToPlex = Movie.CopiedToPlex;
        movieInDb.LentTo = Movie.LentTo;
        movieInDb.Notes = Movie.Notes;

        await _context.SaveChangesAsync();

        return RedirectToPage("./Index");
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
