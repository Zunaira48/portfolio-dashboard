using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/blog")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _db;
    public BlogController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<BlogPostSummaryDto>>> GetAll()
    {
        var posts = await _db.BlogPosts
            .Where(p => p.Published)
            .OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return posts.Select(p => new BlogPostSummaryDto
        {
            Title = p.Title,
            Slug = p.Slug,
            Excerpt = p.Excerpt,
            CoverImageUrl = p.CoverImageUrl,
            Tags = p.Tags,
            PublishedAt = p.PublishedAt
        }).ToList();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetBySlug(string slug)
    {
        var post = await _db.BlogPosts
            .Where(p => p.Published && p.Slug == slug)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (post is null) return NotFound();

        return new BlogPostDetailDto
        {
            Title = post.Title,
            Slug = post.Slug,
            Excerpt = post.Excerpt,
            Content = post.Content,
            CoverImageUrl = post.CoverImageUrl,
            Tags = post.Tags,
            PublishedAt = post.PublishedAt
        };
    }
}