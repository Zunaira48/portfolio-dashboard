using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Dtos;

public class VerifyTokenRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}

public class AdminSessionDto
{
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
}