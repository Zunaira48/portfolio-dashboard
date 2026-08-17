using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using PortfolioApi.Dtos;
using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(AppDbContext db, IEmailService emailService, ILogger<ContactController> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactMessageCreateDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var message = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Subject = dto.Subject?.Trim(),
            Message = dto.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        // Save first — the visitor's message must never be lost even if email fails.
        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();

        try
        {
            await _emailService.SendContactMessageAsync(message.Name, message.Email, message.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Contact message saved (Id={Id}) but the notification email failed to send.", message.Id);
        }

        return Ok(new { success = true, message = "Thanks for reaching out — I'll get back to you soon." });
    }
}