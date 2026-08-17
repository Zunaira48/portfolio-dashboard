namespace PortfolioApi.Models;

public class SkillCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;

    public List<Skill> Skills { get; set; } = new();
}