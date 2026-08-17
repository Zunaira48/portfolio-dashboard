namespace PortfolioApi.Models;

public class Experience
{
    public int Id { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string[] Responsibilities { get; set; } = Array.Empty<string>();
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;

    public List<ExperienceTechnology> Technologies { get; set; } = new();
}