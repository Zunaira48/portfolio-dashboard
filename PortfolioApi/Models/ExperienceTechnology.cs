namespace PortfolioApi.Models;

public class ExperienceTechnology
{
    public int Id { get; set; }
    public int ExperienceId { get; set; }
    public Experience? Experience { get; set; }
    public string Name { get; set; } = string.Empty;
}