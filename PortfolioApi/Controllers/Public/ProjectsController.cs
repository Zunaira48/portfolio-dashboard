using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetAll()
    {
        var projects = await _db.Projects
            .Where(p => p.Published)
            .Include(p => p.Technologies)
            .OrderBy(p => p.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return projects.Select(ToDto).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetBySlug(string slug)
    {
        var project = await _db.Projects
            .Where(p => p.Published && p.Slug == slug)
            .Include(p => p.Technologies)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return project is null ? NotFound() : ToDto(project);
    }

    private static ProjectDto ToDto(Models.Project p) => new()
    {
        Id = p.Id,
        Title = p.Title,
    
        Slug = p.Slug,
        ShortDescription = p.ShortDescription,
        FullDescription = p.FullDescription,
        ImageUrl = p.ImageUrl,
        ImageAlt = p.ImageAlt,
        GalleryUrls = p.GalleryUrls,
        ArchitectureFlow = p.ArchitectureFlow,
        GitHubUrl = p.GitHubUrl,
        LiveUrl = p.LiveUrl,
        Category = p.Category,
        Featured = p.Featured,
        Technologies = p.Technologies.Select(t => t.Name).ToList()
    };
}