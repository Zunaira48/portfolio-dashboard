namespace PortfolioApi.Models;

public class Education
{
    public int Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public string? Specialization { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;
}