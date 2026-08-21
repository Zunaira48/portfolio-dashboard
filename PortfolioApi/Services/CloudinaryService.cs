using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace PortfolioApi.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var cloudName = config["Cloudinary:CloudName"] ?? throw new InvalidOperationException("Cloudinary:CloudName is not configured.");
        var apiKey = config["Cloudinary:ApiKey"] ?? throw new InvalidOperationException("Cloudinary:ApiKey is not configured.");
        var apiSecret = config["Cloudinary:ApiSecret"] ?? throw new InvalidOperationException("Cloudinary:ApiSecret is not configured.");

        _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        _cloudinary.Api.Secure = true;
    }
    public async Task<UploadResult> UploadRawFileAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new RawUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "portfolio/documents"
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error is not null)
            throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");

        return new UploadResult { Url = result.SecureUrl.ToString(), PublicId = result.PublicId };
    }
    
    public async Task<UploadResult> UploadImageAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "portfolio", // keeps all your assets grouped in one Cloudinary folder
            UseFilename = false,  // let Cloudinary generate a safe, collision-free public_id
            UniqueFilename = true,
            Overwrite = false
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error is not null)
            throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");

        return new UploadResult { Url = result.SecureUrl.ToString(), PublicId = result.PublicId };
    }

    public async Task<UploadResult> UploadVideoAsync(Stream fileStream, string fileName)
{
    var uploadParams = new VideoUploadParams
    {
        File = new FileDescription(fileName, fileStream),
        Folder = "portfolio/videos",
        UseFilename = false,
        UniqueFilename = true,
        Overwrite = false
    };

    var result = await _cloudinary.UploadAsync(uploadParams);

    if (result.Error is not null)
        throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");

    return new UploadResult { Url = result.SecureUrl.ToString(), PublicId = result.PublicId };
}

    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}