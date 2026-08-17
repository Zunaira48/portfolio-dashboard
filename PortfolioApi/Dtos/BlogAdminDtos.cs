using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Dtos;

public class BlogPostUpsertDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Slug { get; set; } = string.Empty;

    [Required, StringLength(500)]
    public string Excerpt { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool Published { get; set; } = true;
}