namespace PortfolioApi.Models;

public class Certification
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Issuer { get; set; }
    public string IssueDate { get; set; } = string.Empty;
    public string? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;
}