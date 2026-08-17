namespace PortfolioApi.Models;

public class Skill
{
    public int Id { get; set; }
    public int SkillCategoryId { get; set; }
    public SkillCategory? SkillCategory { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? IconKey { get; set; }
    public int? Proficiency { get; set; } // optional, 0-100, null = not shown — never invent this value
    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;
}