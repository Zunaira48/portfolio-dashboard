using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/certifications")]
public class CertificationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public CertificationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<CertificationDto>>> GetAll()
    {
        var items = await _db.Certifications
            .Where(c => c.Published)
            .OrderBy(c => c.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return items.Select(c => new CertificationDto
        {
            Title = c.Title,
            Issuer = c.Issuer,
            IssueDate = c.IssueDate,
            ExpiryDate = c.ExpiryDate,
            CredentialId = c.CredentialId,
            CredentialUrl = c.CredentialUrl,
            ImageUrl = c.ImageUrl,
            Description = c.Description
        }).ToList();
    }
}