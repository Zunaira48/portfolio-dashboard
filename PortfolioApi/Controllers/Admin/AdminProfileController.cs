using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

// Profile is a singleton — one row represents "your" identity.
// GET/PUT only, no create or delete: the row always exists (seeded in DataSeeder).
[ApiController]
[Route("api/admin/profile")]
[Authorize(Policy = "AdminOnly")]
public class AdminProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminProfileController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<Profile>> Get()
    {
        var profile = await _db.Profiles.FirstOrDefaultAsync();
        return profile is null ? NotFound() : profile;
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ProfileUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var profile = await _db.Profiles.FirstOrDefaultAsync();
        if (profile is null) return NotFound();

        profile.FullName = dto.FullName;
        profile.Titles = dto.Titles;
        profile.HeroDescription = dto.HeroDescription;
        profile.AboutDescription = dto.AboutDescription;
        profile.Location = dto.Location;
        profile.ProfileImageUrl = dto.ProfileImageUrl;
        profile.ResumeUrl = dto.ResumeUrl;
        profile.ContactEmail = dto.ContactEmail;
        profile.AvailabilityStatus = dto.AvailabilityStatus;
        profile.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}