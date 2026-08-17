using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/contact-messages")]
[Authorize(Policy = "AdminOnly")]
public class AdminContactMessagesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminContactMessagesController(AppDbContext db) => _db = db;

    // GET /api/admin/contact-messages?search=foo&unreadOnly=true
    [HttpGet]
    public async Task<ActionResult<List<ContactMessage>>> GetAll([FromQuery] string? search, [FromQuery] bool? unreadOnly)
    {
        var query = _db.ContactMessages.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(m =>
                EF.Functions.ILike(m.Name, $"%{term}%") ||
                EF.Functions.ILike(m.Email, $"%{term}%") ||
                (m.Subject != null && EF.Functions.ILike(m.Subject, $"%{term}%")) ||
                EF.Functions.ILike(m.Message, $"%{term}%"));
        }

        if (unreadOnly == true)
            query = query.Where(m => !m.IsRead);

        return await query.OrderByDescending(m => m.CreatedAt).ToListAsync();
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkRead(int id, [FromQuery] bool isRead = true)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message is null) return NotFound();

        message.IsRead = isRead;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message is null) return NotFound();

        _db.ContactMessages.Remove(message);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}