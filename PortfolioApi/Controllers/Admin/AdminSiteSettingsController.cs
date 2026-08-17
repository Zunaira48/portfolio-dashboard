using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/site-settings")]
[Authorize(Policy = "AdminOnly")]
public class AdminSiteSettingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminSiteSettingsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SiteSetting>>> GetAll()
        => await _db.SiteSettings.OrderBy(s => s.Key).ToListAsync();

    [HttpPut]
    public async Task<ActionResult<SiteSetting>> Upsert([FromBody] SiteSettingUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var setting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == dto.Key);
        if (setting is null)
        {
            setting = new SiteSetting { Key = dto.Key, Value = dto.Value };
            _db.SiteSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Value;
        }

        await _db.SaveChangesAsync();
        return Ok(setting);
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        var setting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting is null) return NotFound();

        _db.SiteSettings.Remove(setting);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}