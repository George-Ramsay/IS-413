using Assignment_6.Data;
using Assignment_6.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Assignment_6.Pages.Movies;

public class IndexModel : PageModel
{
    private readonly MovieCollectionContext _context;

    public IndexModel(MovieCollectionContext context)
    {
        _context = context;
    }

    public IList<Movie> Movies { get; private set; } = new List<Movie>();

    public async Task OnGetAsync()
    {
        Movies = await _context.Movies
            .AsNoTracking()
            .Include(movie => movie.Category)
            .OrderBy(movie => movie.Title)
            .ToListAsync();
    }

    public async Task<IActionResult> OnPostDeleteAsync(int id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie != null)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage();
    }
}
