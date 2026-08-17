using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/education")]
public class EducationController : ControllerBase
{
    private readonly AppDbContext _db;
    public EducationController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<EducationDto>>> GetAll()
    {
        var items = await _db.Educations
            .Where(e => e.Published)
            .OrderBy(e => e.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return items.Select(e => new EducationDto
        {
            Degree = e.Degree,
            Institution = e.Institution,
            Location = e.Location,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Specialization = e.Specialization,
            Description = e.Description
        }).ToList();
    }
}