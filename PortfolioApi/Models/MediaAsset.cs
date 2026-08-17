namespace PortfolioApi.Models;

public class MediaAsset
{
    public int Id { get; set; }
    public string PublicId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public string Type { get; set; } = "image";
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}