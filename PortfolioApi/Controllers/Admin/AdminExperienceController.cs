using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/experience")]
[Authorize(Policy = "AdminOnly")]
public class AdminExperienceController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminExperienceController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Experience>>> GetAll()
        => await _db.Experiences.Include(e => e.Technologies).OrderBy(e => e.DisplayOrder).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Experience>> GetById(int id)
    {
        var exp = await _db.Experiences.Include(e => e.Technologies).FirstOrDefaultAsync(e => e.Id == id);
        return exp is null ? NotFound() : exp;
    }

    [HttpPost]
    public async Task<ActionResult<Experience>> Create([FromBody] ExperienceUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var experience = new Experience
        {
            JobTitle = dto.JobTitle,
            Company = dto.Company,
            Location = dto.Location,
            EmploymentType = dto.EmploymentType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsCurrent = dto.IsCurrent,
            Responsibilities = dto.Responsibilities,
            DisplayOrder = dto.DisplayOrder,
            Published = dto.Published,
            Technologies = dto.Technologies.Select(t => new ExperienceTechnology { Name = t }).ToList()
        };

        _db.Experiences.Add(experience);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = experience.Id }, experience);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ExperienceUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var experience = await _db.Experiences.Include(e => e.Technologies).FirstOrDefaultAsync(e => e.Id == id);
        if (experience is null) return NotFound();

        experience.JobTitle = dto.JobTitle;
        experience.Company = dto.Company;
        experience.Location = dto.Location;
        experience.EmploymentType = dto.EmploymentType;
        experience.StartDate = dto.StartDate;
        experience.EndDate = dto.EndDate;
        experience.IsCurrent = dto.IsCurrent;
        experience.Responsibilities = dto.Responsibilities;
        experience.DisplayOrder = dto.DisplayOrder;
        experience.Published = dto.Published;

        _db.ExperienceTechnologies.RemoveRange(experience.Technologies);
        experience.Technologies = dto.Technologies.Select(t => new ExperienceTechnology { Name = t, ExperienceId = id }).ToList();

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var experience = await _db.Experiences.FindAsync(id);
        if (experience is null) return NotFound();

        _db.Experiences.Remove(experience);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}