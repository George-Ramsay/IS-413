namespace BowlingLeague.API.Dtos;

public class BowlerSummaryDto
{
    public string? FirstName { get; set; }

    public string? MiddleInitial { get; set; }

    public string? LastName { get; set; }

    public string TeamName { get; set; } = string.Empty;

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Zip { get; set; }

    public string? PhoneNumber { get; set; }
}
