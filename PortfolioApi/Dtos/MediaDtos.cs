namespace PortfolioApi.Dtos;

public class MediaAssetDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}