using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/social-links")]
[Authorize(Policy = "AdminOnly")]
public class AdminSocialLinksController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminSocialLinksController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SocialLink>>> GetAll()
        => await _db.SocialLinks.OrderBy(s => s.DisplayOrder).ToListAsync();

    [HttpPost]
    public async Task<ActionResult<SocialLink>> Create([FromBody] SocialLinkUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var link = new SocialLink
        {
            Platform = dto.Platform,
            Url = dto.Url,
            IconKey = dto.IconKey,
            DisplayOrder = dto.DisplayOrder,
            Active = dto.Active
        };
        _db.SocialLinks.Add(link);
        await _db.SaveChangesAsync();
        return Ok(link);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SocialLinkUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var link = await _db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();

        link.Platform = dto.Platform;
        link.Url = dto.Url;
        link.IconKey = dto.IconKey;
        link.DisplayOrder = dto.DisplayOrder;
        link.Active = dto.Active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var link = await _db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();

        _db.SocialLinks.Remove(link);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}