namespace PortfolioApi.Models;

public class SocialLink
{
    public int Id { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? IconKey { get; set; }
    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;
}