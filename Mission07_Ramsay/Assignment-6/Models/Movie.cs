using System.ComponentModel.DataAnnotations;

namespace Assignment_6.Models;

public class Movie
{
    [Key]
    public int MovieId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public int? CategoryId { get; set; }

    public Category? Category { get; set; }

    [Required]
    [Range(1888, int.MaxValue, ErrorMessage = "Year must be 1888 or later.")]
    public int Year { get; set; }

    public string? Director { get; set; }

    public string? Rating { get; set; }

    [Display(Name = "Edited")]
    public bool Edited { get; set; }

    [Display(Name = "Copied To Plex")]
    public bool CopiedToPlex { get; set; }

    [Display(Name = "Lent To")]
    public string? LentTo { get; set; }

    [StringLength(25)]
    [Display(Name = "Notes")]
    public string? Notes { get; set; }
}
