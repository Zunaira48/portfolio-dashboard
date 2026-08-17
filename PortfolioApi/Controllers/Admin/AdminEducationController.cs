using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/education")]
[Authorize(Policy = "AdminOnly")]
public class AdminEducationController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminEducationController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Education>>> GetAll()
        => await _db.Educations.OrderBy(e => e.DisplayOrder).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Education>> GetById(int id)
    {
        var edu = await _db.Educations.FindAsync(id);
        return edu is null ? NotFound() : edu;
    }

    [HttpPost]
    public async Task<ActionResult<Education>> Create([FromBody] EducationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var education = new Education
        {
            Degree = dto.Degree,
            Institution = dto.Institution,
            Location = dto.Location,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Specialization = dto.Specialization,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            Published = dto.Published
        };

        _db.Educations.Add(education);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = education.Id }, education);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EducationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var education = await _db.Educations.FindAsync(id);
        if (education is null) return NotFound();

        education.Degree = dto.Degree;
        education.Institution = dto.Institution;
        education.Location = dto.Location;
        education.StartDate = dto.StartDate;
        education.EndDate = dto.EndDate;
        education.Specialization = dto.Specialization;
        education.Description = dto.Description;
        education.DisplayOrder = dto.DisplayOrder;
        education.Published = dto.Published;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var education = await _db.Educations.FindAsync(id);
        if (education is null) return NotFound();

        _db.Educations.Remove(education);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}