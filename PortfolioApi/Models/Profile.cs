namespace PortfolioApi.Models;

public class Profile
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string[] Titles { get; set; } = Array.Empty<string>();
    public string HeroDescription { get; set; } = string.Empty;
    public string AboutDescription { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string AvailabilityStatus { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}