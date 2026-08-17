using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/media")]
[Authorize(Policy = "AdminOnly")]
public class AdminMediaController : ControllerBase
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB — generous for a portfolio, protects Cloudinary's free 25 credits/month

    // Real image file signatures ("magic bytes") — checking these instead of trusting
    // the filename extension is what actually stops someone renaming malware.exe to
    // photo.jpg and uploading it.
    private static readonly Dictionary<string, byte[]> AllowedSignatures = new()
    {
        ["image/jpeg"] = new byte[] { 0xFF, 0xD8, 0xFF },
        ["image/png"] = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A },
        ["image/webp"] = new byte[] { 0x52, 0x49, 0x46, 0x46 }, // "RIFF" header (WEBP-specific bytes follow at offset 8, checked separately)
        ["application/pdf"] = new byte[] { 0x25, 0x50, 0x44, 0x46 } // "%PDF"
    };

    private readonly AppDbContext _db;
    private readonly ICloudinaryService _cloudinary;
    private readonly ILogger<AdminMediaController> _logger;

    public AdminMediaController(AppDbContext db, ICloudinaryService cloudinary, ILogger<AdminMediaController> logger)
    {
        _db = db;
        _cloudinary = cloudinary;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<MediaAssetDto>>> GetAll()
    {
        var assets = await _db.MediaAssets.OrderByDescending(m => m.UploadedAt).ToListAsync();
        return assets.Select(a => new MediaAssetDto
        {
            Id = a.Id,
            Url = a.Url,
            AltText = a.AltText,
            Type = a.Type,
            UploadedAt = a.UploadedAt
        }).ToList();
    }

    [HttpPost("upload")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<IActionResult> Upload(IFormFile? file, [FromForm] string? altText)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "No file was uploaded." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "File exceeds the 5MB size limit." });

        await using var stream = file.OpenReadStream();
        var detectedType = await DetectImageTypeAsync(stream);

        if (detectedType is null)
            return BadRequest(new { message = "Unsupported or invalid file. Only JPEG, PNG, WEBP images, and PDF documents are allowed." });

        stream.Position = 0; // reset after reading the header bytes for validation

        try
        {
            var isPdf = detectedType == "application/pdf";
            var result = isPdf
                ? await _cloudinary.UploadRawFileAsync(stream, file.FileName)
                : await _cloudinary.UploadImageAsync(stream, file.FileName);

            var asset = new MediaAsset
            {
                PublicId = result.PublicId,
                Url = result.Url,
                AltText = altText,
                Type = isPdf ? "document" : "image",
                UploadedAt = DateTime.UtcNow
            };

            _db.MediaAssets.Add(asset);
            await _db.SaveChangesAsync();

            return Ok(new MediaAssetDto { Id = asset.Id, Url = asset.Url, AltText = asset.AltText, Type = asset.Type, UploadedAt = asset.UploadedAt });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Cloudinary upload failed for file {FileName}.", file.FileName);
            return StatusCode(502, new { message = "Image upload to storage provider failed. Please try again." });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var asset = await _db.MediaAssets.FindAsync(id);
        if (asset is null) return NotFound();

        try
        {
            await _cloudinary.DeleteImageAsync(asset.PublicId);
        }
        catch (Exception ex)
        {
            // Don't block DB cleanup if Cloudinary's already lost track of it — log and continue.
            _logger.LogWarning(ex, "Could not delete Cloudinary asset {PublicId}, removing DB record anyway.", asset.PublicId);
        }

        _db.MediaAssets.Remove(asset);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static async Task<string?> DetectImageTypeAsync(Stream stream)
    {
        var header = new byte[12];
        var bytesRead = await stream.ReadAsync(header.AsMemory(0, 12));
        if (bytesRead < 4) return null;

        foreach (var (mimeType, signature) in AllowedSignatures)
        {
            if (header.Take(signature.Length).SequenceEqual(signature))
            {
                if (mimeType == "image/webp")
                {
                    // RIFF header alone isn't specific enough — confirm bytes 8-11 spell "WEBP"
                    var webpMarker = System.Text.Encoding.ASCII.GetString(header, 8, 4);
                    if (webpMarker != "WEBP") continue;
                }
                return mimeType;
            }
        }
        return null;
    }
}