using BowlingLeague.API.Data;
using BowlingLeague.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BowlingLeague.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BowlersController(BowlingLeagueContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BowlerSummaryDto>>> GetBowlers()
    {
        var bowlers = await context.Bowlers
            .AsNoTracking()
            .Where(b => b.Team != null && (b.Team.TeamName == "Marlins" || b.Team.TeamName == "Sharks"))
            .Select(b => new BowlerSummaryDto
            {
                FirstName = b.BowlerFirstName,
                MiddleInitial = b.BowlerMiddleInit,
                LastName = b.BowlerLastName,
                TeamName = b.Team!.TeamName,
                Address = b.BowlerAddress,
                City = b.BowlerCity,
                State = b.BowlerState,
                Zip = b.BowlerZip,
                PhoneNumber = b.BowlerPhoneNumber
            })
            .ToListAsync();

        return Ok(bowlers);
    }
}
