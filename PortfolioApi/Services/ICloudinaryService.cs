namespace PortfolioApi.Services;

public class UploadResult
{
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
}

public interface ICloudinaryService
{
    Task<UploadResult> UploadImageAsync(Stream fileStream, string fileName);
    Task<UploadResult> UploadRawFileAsync(Stream fileStream, string fileName);
    Task DeleteImageAsync(string publicId);
}