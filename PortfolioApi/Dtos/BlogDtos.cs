namespace PortfolioApi.Dtos;

public class BlogPostSummaryDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public string[] Tags { get; set; } = Array.Empty<string>();
    public DateTime? PublishedAt { get; set; }
}

public class BlogPostDetailDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public string[] Tags { get; set; } = Array.Empty<string>();
    public DateTime? PublishedAt { get; set; }
}