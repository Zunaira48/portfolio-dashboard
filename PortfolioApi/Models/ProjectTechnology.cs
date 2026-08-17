namespace PortfolioApi.Models;

public class ProjectTechnology
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Name { get; set; } = string.Empty;
}