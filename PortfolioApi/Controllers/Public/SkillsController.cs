using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/skills")]
public class SkillsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SkillsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SkillCategoryDto>>> GetAll()
    {
        var categories = await _db.SkillCategories
            .Where(c => c.Active)
            .Include(c => c.Skills.Where(s => s.Active))
            .OrderBy(c => c.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return categories.Select(c => new SkillCategoryDto
        {
            Name = c.Name,
            Skills = c.Skills.OrderBy(s => s.DisplayOrder)
                .Select(s => new SkillDto { Name = s.Name, IconKey = s.IconKey, Proficiency = s.Proficiency })
                .ToList()
        }).ToList();
    }
}