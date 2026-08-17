using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/blog")]
[Authorize(Policy = "AdminOnly")]
public class AdminBlogController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminBlogController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<BlogPost>>> GetAll()
        => await _db.BlogPosts.OrderByDescending(p => p.CreatedAt).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BlogPost>> GetById(int id)
    {
        var post = await _db.BlogPosts.FindAsync(id);
        return post is null ? NotFound() : post;
    }

    [HttpPost]
    public async Task<ActionResult<BlogPost>> Create([FromBody] BlogPostUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        if (await _db.BlogPosts.AnyAsync(p => p.Slug == dto.Slug))
            return Conflict(new { message = $"A blog post with slug '{dto.Slug}' already exists." });

        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Excerpt = dto.Excerpt,
            Content = dto.Content,
            CoverImageUrl = dto.CoverImageUrl,
            Tags = dto.Tags.ToArray(),
            Published = dto.Published,
            PublishedAt = dto.Published ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.BlogPosts.Add(post);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] BlogPostUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var post = await _db.BlogPosts.FindAsync(id);
        if (post is null) return NotFound();

        if (await _db.BlogPosts.AnyAsync(p => p.Slug == dto.Slug && p.Id != id))
            return Conflict(new { message = $"A blog post with slug '{dto.Slug}' already exists." });

        var wasPublished = post.Published;

        post.Title = dto.Title;
        post.Slug = dto.Slug;
        post.Excerpt = dto.Excerpt;
        post.Content = dto.Content;
        post.CoverImageUrl = dto.CoverImageUrl;
        post.Tags = dto.Tags.ToArray();
        post.Published = dto.Published;
        post.UpdatedAt = DateTime.UtcNow;

        if (!wasPublished && dto.Published)
            post.PublishedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _db.BlogPosts.FindAsync(id);
        if (post is null) return NotFound();

        _db.BlogPosts.Remove(post);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}