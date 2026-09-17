using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/projects")]
[Authorize(Policy = "AdminOnly")]
public class AdminProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminProjectsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Project>>> GetAll()
        => await _db.Projects.Include(p => p.Technologies).OrderBy(p => p.DisplayOrder).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Project>> GetById(int id)
    {
        var project = await _db.Projects.Include(p => p.Technologies).FirstOrDefaultAsync(p => p.Id == id);
        return project is null ? NotFound() : project;
    }

    [HttpPost]
    public async Task<ActionResult<Project>> Create([FromBody] ProjectUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        if (await _db.Projects.AnyAsync(p => p.Slug == dto.Slug))
            return Conflict(new { message = $"A project with slug '{dto.Slug}' already exists." });

        var project = new Project
        {
            Title = dto.Title,
            Slug = dto.Slug,
            ShortDescription = dto.ShortDescription,
            FullDescription = dto.FullDescription,
            ImageUrl = dto.ImageUrl,
            ImageAlt = dto.ImageAlt,
            GitHubUrl = dto.GitHubUrl,
            LiveUrl = dto.LiveUrl,
            Category = dto.Category,
            Featured = dto.Featured,
            Published = dto.Published,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Technologies = dto.Technologies.Select(t => new ProjectTechnology { Name = t }).ToList(),
            GalleryUrls = dto.GalleryUrls,
            ArchitectureFlow = dto.ArchitectureFlow,
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var project = await _db.Projects.Include(p => p.Technologies).FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();

        if (await _db.Projects.AnyAsync(p => p.Slug == dto.Slug && p.Id != id))
            return Conflict(new { message = $"A project with slug '{dto.Slug}' already exists." });

        project.Title = dto.Title;
        project.Slug = dto.Slug;
        project.ShortDescription = dto.ShortDescription;
        project.FullDescription = dto.FullDescription;
        project.ImageUrl = dto.ImageUrl;
        project.ImageAlt = dto.ImageAlt;
        project.GitHubUrl = dto.GitHubUrl;
        project.LiveUrl = dto.LiveUrl;
        project.Category = dto.Category;
        project.Featured = dto.Featured;
        project.Published = dto.Published;
        project.DisplayOrder = dto.DisplayOrder;
        project.UpdatedAt = DateTime.UtcNow;

        _db.ProjectTechnologies.RemoveRange(project.Technologies);
        project.Technologies = dto.Technologies.Select(t => new ProjectTechnology { Name = t, ProjectId = id }).ToList();
        project.GalleryUrls = dto.GalleryUrls;
        project.ArchitectureFlow = dto.ArchitectureFlow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}