using System.ComponentModel.DataAnnotations;

namespace Assignment_6.Models;

public class Movie
{
    [Key]
    public int MovieId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    public string Director { get; set; } = string.Empty;

    [Required]
    public string Rating { get; set; } = string.Empty;

    [Display(Name = "Edited")]
    public bool? Edited { get; set; }

    [Display(Name = "Lent To")]
    public string? LentTo { get; set; }

    [StringLength(25)]
    [Display(Name = "Notes")]
    public string? Notes { get; set; }
}
