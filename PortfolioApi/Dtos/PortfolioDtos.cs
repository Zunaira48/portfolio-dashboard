using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Dtos;

public class ProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string[] Titles { get; set; } = Array.Empty<string>();
    public string HeroDescription { get; set; } = string.Empty;
    public string AboutDescription { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string AvailabilityStatus { get; set; } = string.Empty;
}

public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public List<string> Technologies { get; set; } = new();
}

public class SkillDto
{
    public string Name { get; set; } = string.Empty;
    public string? IconKey { get; set; }
    public int? Proficiency { get; set; }
}

public class SkillCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public List<SkillDto> Skills { get; set; } = new();
}

public class ExperienceDto
{
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string Responsibilities { get; set; } = string.Empty;
    public List<string> Technologies { get; set; } = new();
}

public class EducationDto
{
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public string? Specialization { get; set; }
    public string? Description { get; set; }
}

public class CertificationDto
{
    public string Title { get; set; } = string.Empty;
    public string? Issuer { get; set; }
    public string IssueDate { get; set; } = string.Empty;
    public string? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
}

public class SocialLinkDto
{
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? IconKey { get; set; }
}

public class ContactMessageCreateDto
{
    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Subject { get; set; }

    [Required, StringLength(2000)]
    public string Message { get; set; } = string.Empty;
}