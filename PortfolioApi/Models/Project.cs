namespace PortfolioApi.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public bool Published { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<ProjectTechnology> Technologies { get; set; } = new();
}