using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Models;

public class ContactMessage
{
    public int Id { get; set; }

    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Subject { get; set; }

    [Required, StringLength(2000)]
    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}