using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProfileController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> Get()
    {
        var profile = await _db.Profiles.AsNoTracking().FirstOrDefaultAsync();
        if (profile is null) return NotFound();

        return new ProfileDto
        {
            FullName = profile.FullName,
            Titles = profile.Titles,
            HeroDescription = profile.HeroDescription,
            AboutDescription = profile.AboutDescription,
            Location = profile.Location,
            ProfileImageUrl = profile.ProfileImageUrl,
            ResumeUrl = profile.ResumeUrl,
            ContactEmail = profile.ContactEmail,
            AvailabilityStatus = profile.AvailabilityStatus
        };
    }
}