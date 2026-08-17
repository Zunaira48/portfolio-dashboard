using Microsoft.EntityFrameworkCore;
using PortfolioApi.Models;

namespace PortfolioApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTechnology> ProjectTechnologies => Set<ProjectTechnology>();
    public DbSet<SkillCategory> SkillCategories => Set<SkillCategory>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<ExperienceTechnology> ExperienceTechnologies => Set<ExperienceTechnology>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<Project>()
            .HasMany(p => p.Technologies)
            .WithOne(t => t.Project)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SkillCategory>()
            .HasMany(c => c.Skills)
            .WithOne(s => s.SkillCategory)
            .HasForeignKey(s => s.SkillCategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Experience>()
            .HasMany(e => e.Technologies)
            .WithOne(t => t.Experience)
            .HasForeignKey(t => t.ExperienceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SiteSetting>()
            .HasIndex(s => s.Key)
            .IsUnique();

        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique();
    }
}