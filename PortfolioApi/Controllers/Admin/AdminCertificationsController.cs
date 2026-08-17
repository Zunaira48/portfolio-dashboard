using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/certifications")]
[Authorize(Policy = "AdminOnly")]
public class AdminCertificationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminCertificationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Certification>>> GetAll()
        => await _db.Certifications.OrderBy(c => c.DisplayOrder).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Certification>> GetById(int id)
    {
        var cert = await _db.Certifications.FindAsync(id);
        return cert is null ? NotFound() : cert;
    }

    [HttpPost]
    public async Task<ActionResult<Certification>> Create([FromBody] CertificationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var cert = new Certification
        {
            Title = dto.Title,
            Issuer = dto.Issuer,
            IssueDate = dto.IssueDate,
            ExpiryDate = dto.ExpiryDate,
            CredentialId = dto.CredentialId,
            CredentialUrl = dto.CredentialUrl,
            ImageUrl = dto.ImageUrl,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            Published = dto.Published
        };

        _db.Certifications.Add(cert);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = cert.Id }, cert);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CertificationUpsertDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var cert = await _db.Certifications.FindAsync(id);
        if (cert is null) return NotFound();

        cert.Title = dto.Title;
        cert.Issuer = dto.Issuer;
        cert.IssueDate = dto.IssueDate;
        cert.ExpiryDate = dto.ExpiryDate;
        cert.CredentialId = dto.CredentialId;
        cert.CredentialUrl = dto.CredentialUrl;
        cert.ImageUrl = dto.ImageUrl;
        cert.Description = dto.Description;
        cert.DisplayOrder = dto.DisplayOrder;
        cert.Published = dto.Published;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cert = await _db.Certifications.FindAsync(id);
        if (cert is null) return NotFound();

        _db.Certifications.Remove(cert);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}