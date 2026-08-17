using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using Microsoft.EntityFrameworkCore;
namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/site-settings")]
public class SiteSettingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SiteSettingsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, string>>> GetAll()
    {
        var settings = await _db.SiteSettings.AsNoTracking().ToListAsync();
        return settings.ToDictionary(s => s.Key, s => s.Value);
    }
}