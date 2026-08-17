using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/social-links")]
public class SocialLinksController : ControllerBase
{
    private readonly AppDbContext _db;
    public SocialLinksController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SocialLinkDto>>> GetAll()
    {
        var items = await _db.SocialLinks
            .Where(s => s.Active)
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return items.Select(s => new SocialLinkDto { Platform = s.Platform, Url = s.Url, IconKey = s.IconKey }).ToList();
    }
}