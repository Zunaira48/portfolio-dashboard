using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/skill-categories")]
[Authorize(Policy = "AdminOnly")]
public class AdminSkillCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminSkillCategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SkillCategory>>> GetAll()
        => await _db.SkillCategories.Include(c => c.Skills).OrderBy(c => c.DisplayOrder).ToListAsync();

    [HttpPost]
    public async Task<ActionResult<SkillCategory>> Create([FromBody] SkillCategoryUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var category = new SkillCategory { Name = dto.Name, DisplayOrder = dto.DisplayOrder, Active = dto.Active };
        _db.SkillCategories.Add(category);
        await _db.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SkillCategoryUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var category = await _db.SkillCategories.FindAsync(id);
        if (category is null) return NotFound();

        category.Name = dto.Name;
        category.DisplayOrder = dto.DisplayOrder;
        category.Active = dto.Active;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _db.SkillCategories.FindAsync(id);
        if (category is null) return NotFound();

        _db.SkillCategories.Remove(category); // cascades to child Skills
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/admin/skills")]
[Authorize(Policy = "AdminOnly")]
public class AdminSkillsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminSkillsController(AppDbContext db) => _db = db;

    [HttpPost]
    public async Task<ActionResult<Skill>> Create([FromBody] SkillUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        if (!await _db.SkillCategories.AnyAsync(c => c.Id == dto.SkillCategoryId))
            return BadRequest(new { message = "SkillCategoryId does not exist." });

        var skill = new Skill
        {
            SkillCategoryId = dto.SkillCategoryId,
            Name = dto.Name,
            IconKey = dto.IconKey,
            Proficiency = dto.Proficiency,
            DisplayOrder = dto.DisplayOrder,
            Active = dto.Active
        };
        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();
        return Ok(skill);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SkillUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        skill.SkillCategoryId = dto.SkillCategoryId;
        skill.Name = dto.Name;
        skill.IconKey = dto.IconKey;
        skill.Proficiency = dto.Proficiency;
        skill.DisplayOrder = dto.DisplayOrder;
        skill.Active = dto.Active;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        _db.Skills.Remove(skill);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}