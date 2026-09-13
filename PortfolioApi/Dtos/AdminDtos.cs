using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Dtos;

// ---------- Projects ----------
public class ProjectUpsertDto
{
    [Required, StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Slug { get; set; } = string.Empty;

    [Required, StringLength(500)]
    public string ShortDescription { get; set; } = string.Empty;

    [Required]
    public string FullDescription { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LiveUrl { get; set; }

    [Required, StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public bool Featured { get; set; }
    public bool Published { get; set; } = true;
    public int DisplayOrder { get; set; }
    public List<string> Technologies { get; set; } = new();
}

// ---------- Skills ----------
public class SkillCategoryUpsertDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;
}

public class SkillUpsertDto
{
    [Required]
    public int SkillCategoryId { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? IconKey { get; set; }

    [Range(0, 100)]
    public int? Proficiency { get; set; } // optional — never auto-filled, admin enters manually or leaves blank

    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;
}

// ---------- Experience ----------
public class ExperienceUpsertDto
{
    [Required, StringLength(150)]
    public string JobTitle { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Company { get; set; } = string.Empty;

    public string? Location { get; set; }
    public string? EmploymentType { get; set; }

    [Required, StringLength(20)]
    public string StartDate { get; set; } = string.Empty;

    public string? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string Responsibilities { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;
    public List<string> Technologies { get; set; } = new();
}

// ---------- Education ----------
public class EducationUpsertDto
{
    [Required, StringLength(200)]
    public string Degree { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Institution { get; set; } = string.Empty;

    public string? Location { get; set; }

    [Required, StringLength(20)]
    public string StartDate { get; set; } = string.Empty;

    public string? EndDate { get; set; }
    public string? Specialization { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;
}

// ---------- Profile ----------
public class ProfileUpsertDto
{
    [Required, StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    public string[] Titles { get; set; } = Array.Empty<string>();

    [Required]
    public string HeroDescription { get; set; } = string.Empty;

    [Required]
    public string AboutDescription { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Location { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }
    public string? ResumeUrl { get; set; }

    [Required, EmailAddress]
    public string ContactEmail { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string AvailabilityStatus { get; set; } = string.Empty;
}

// ---------- Social Links ----------
public class SocialLinkUpsertDto
{
    [Required, StringLength(50)]
    public string Platform { get; set; } = string.Empty;

    [Required, Url, StringLength(500)]
    public string Url { get; set; } = string.Empty;

    public string? IconKey { get; set; }
    public int DisplayOrder { get; set; }
    public bool Active { get; set; } = true;
}

// ---------- Site Settings ----------
public class SiteSettingUpsertDto
{
    [Required, StringLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Value { get; set; } = string.Empty;
}

// ---------- Certifications ----------
public class CertificationUpsertDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Issuer { get; set; }

    [Required, StringLength(50)]
    public string IssueDate { get; set; } = string.Empty;

    public string? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool Published { get; set; } = true;
// ---------- Blog ----------
public class BlogPostUpsertDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Slug { get; set; } = string.Empty;

    [Required, StringLength(500)]
    public string Excerpt { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool Published { get; set; } = true;
}    
}