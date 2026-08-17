using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/experience")]
public class ExperienceController : ControllerBase
{
    private readonly AppDbContext _db;
    public ExperienceController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ExperienceDto>>> GetAll()
    {
        var items = await _db.Experiences
            .Where(e => e.Published)
            .Include(e => e.Technologies)
            .OrderBy(e => e.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return items.Select(e => new ExperienceDto
        {
            JobTitle = e.JobTitle,
            Company = e.Company,
            Location = e.Location,
            EmploymentType = e.EmploymentType,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            IsCurrent = e.IsCurrent,
            Responsibilities = e.Responsibilities,
            Technologies = e.Technologies.Select(t => t.Name).ToList()
        }).ToList();
    }
}