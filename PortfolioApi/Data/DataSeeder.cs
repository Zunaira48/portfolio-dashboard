using PortfolioApi.Models;

namespace PortfolioApi.Data;

/// <summary>
/// Idempotent seeder — only inserts data the first time each table is empty.
/// Every value here comes directly from Zunaira's CV. Nothing is invented.
/// Fields left blank/empty need to be filled from the Admin Dashboard later.
/// </summary>
public static class DataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Profiles.Any())
        {
            db.Profiles.Add(new Profile
            {
                FullName = "Zunaira Zahid",
                Titles = new[] { "Software Engineer", "QA Engineer", "Information Technology Professional" },
                HeroDescription = "Recent BS Information Technology graduate with a strong foundation in software development and software quality assurance.",
                AboutDescription = "Experienced in building web applications using ASP.NET Core MVC, C#, SQL, HTML, CSS, and JavaScript, along with hands-on practice in manual testing, test case design, regression testing, and bug reporting. Eager to apply technical knowledge, continue learning, and contribute to developing reliable, high-quality software.",
                Location = "Lahore, Pakistan",
                ContactEmail = "zunairazahid2003@gmail.com",
                AvailabilityStatus = "Open to opportunities",
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (!db.Projects.Any())
        {
            db.Projects.AddRange(
                new Project
                {
                    Title = "Viaitalia",
                    Slug = "viaitalia",
                    ShortDescription = "A full-stack travel planning web app that generates personalized itineraries based on user preferences.",
                    FullDescription = "Developed a full-stack travel planning application using ASP.NET Core MVC, structuring routing, controllers, and views for a clean, maintainable codebase. Built logic to generate personalized travel itineraries based on user preferences and designed the supporting database schema. Authored and executed functional test cases covering search, booking, and navigation workflows, and documented defects found during testing.",
                    Category = "Web Development",
                    Featured = true,
                    Published = true, // NOTE: GitHubUrl below is a placeholder from your original code — update it in Admin
                    GitHubUrl = null,
                    DisplayOrder = 1,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "ASP.NET Core MVC" }, new() { Name = "C#" }, new() { Name = "SQL Server" }
                    }
                },
                new Project
                {
                    Title = "Car Lenders",
                    Slug = "car-lenders",
                    ShortDescription = "A responsive vehicle rental and sales platform with dynamic listings and clean navigation.",
                    FullDescription = "Built a responsive front-end for a vehicle rental and sales platform, including dynamic listing pages and intuitive navigation. Tested UI responsiveness and navigation flow across multiple screen sizes and verified form validation and edge-case handling before project completion.",
                    Category = "Frontend",
                    Featured = false,
                    Published = true,
                    GitHubUrl = null,
                    DisplayOrder = 2,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "HTML" }, new() { Name = "CSS" }, new() { Name = "JavaScript" }
                    }
                },
                new Project
                {
                    Title = "Home Recipe",
                    Slug = "home-recipe",
                    ShortDescription = "An interactive recipe discovery site with categorized dishes and an easy-to-browse interface.",
                    FullDescription = "Created an interactive recipe discovery site with categorized dishes and a clean, easy-to-browse information architecture. Performed manual testing on navigation, search, and content display features, reporting usability issues to improve the overall user experience.",
                    Category = "Frontend",
                    Featured = false,
                    Published = true,
                    GitHubUrl = null,
                    DisplayOrder = 3,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "HTML" }, new() { Name = "CSS" }, new() { Name = "JavaScript" }
                    }
                },
                new Project
                {
                    Title = "Manual Testing Practice — E-Commerce",
                    Slug = "manual-testing-practice-ecommerce",
                    ShortDescription = "Self-initiated QA project: test cases and regression cycles for a typical e-commerce checkout flow.",
                    FullDescription = "Authored detailed test cases and scenarios for Login, Registration, Cart, and Checkout modules to build hands-on QA experience. Executed manual test cycles and documented defects with clear expected-versus-actual results. Conducted regression testing after fixes to confirm no impact on existing functionality, and compiled QA documentation reflecting industry-standard practices.",
                    Category = "QA / Testing",
                    Featured = false,
                    Published = false, // was missing from your old ProjectsController entirely — unpublished until you confirm it in Admin
                    DisplayOrder = 4,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "Manual Testing" }, new() { Name = "QA Documentation" }
                    }
                }
            );
        }

        if (!db.SkillCategories.Any())
        {
            var languages = new SkillCategory { Name = "Programming Languages", DisplayOrder = 1, Active = true };
            var webDev    = new SkillCategory { Name = "Web Development", DisplayOrder = 2, Active = true };
            var databases = new SkillCategory { Name = "Databases", DisplayOrder = 3, Active = true };
            var qa        = new SkillCategory { Name = "Software Testing / QA", DisplayOrder = 4, Active = true };
            var core      = new SkillCategory { Name = "Core Concepts", DisplayOrder = 5, Active = true };
            var tools     = new SkillCategory { Name = "Tools & Platforms", DisplayOrder = 6, Active = true };
            var docs      = new SkillCategory { Name = "Documentation", DisplayOrder = 7, Active = true };

            languages.Skills.AddRange(new[]
            {
                new Skill { Name = "C", DisplayOrder = 1 }, new Skill { Name = "C++", DisplayOrder = 2 },
                new Skill { Name = "C#", DisplayOrder = 3 }, new Skill { Name = "Java", DisplayOrder = 4 },
                new Skill { Name = "JavaScript", DisplayOrder = 5 },
            });
            webDev.Skills.AddRange(new[]
            {
                new Skill { Name = "ASP.NET Core MVC", DisplayOrder = 1 },
                new Skill { Name = "HTML5", DisplayOrder = 2 }, new Skill { Name = "CSS3", DisplayOrder = 3 },
            });
            databases.Skills.AddRange(new[]
            {
                new Skill { Name = "SQL", DisplayOrder = 1 }, new Skill { Name = "MySQL", DisplayOrder = 2 },
                new Skill { Name = "DBMS", DisplayOrder = 3 },
            });
            qa.Skills.AddRange(new[]
            {
                new Skill { Name = "Manual Testing", DisplayOrder = 1 }, new Skill { Name = "Functional Testing", DisplayOrder = 2 },
                new Skill { Name = "Regression Testing", DisplayOrder = 3 }, new Skill { Name = "Test Case Design", DisplayOrder = 4 },
                new Skill { Name = "Bug Reporting", DisplayOrder = 5 },
            });
            core.Skills.AddRange(new[]
            {
                new Skill { Name = "Object-Oriented Programming (OOP)", DisplayOrder = 1 },
                new Skill { Name = "Data Structures & Algorithms (DSA)", DisplayOrder = 2 },
                new Skill { Name = "SDLC", DisplayOrder = 3 }, new Skill { Name = "STLC", DisplayOrder = 4 },
            });
            tools.Skills.AddRange(new[]
            {
                new Skill { Name = "Visual Studio", DisplayOrder = 1 }, new Skill { Name = "Git", DisplayOrder = 2 },
                new Skill { Name = "Postman (Basic)", DisplayOrder = 3 }, new Skill { Name = "MS Word/Excel/PowerPoint", DisplayOrder = 4 },
                new Skill { Name = "Windows", DisplayOrder = 5 }, new Skill { Name = "Linux", DisplayOrder = 6 },
            });
            docs.Skills.AddRange(new[]
            {
                new Skill { Name = "Technical Documentation", DisplayOrder = 1 },
                new Skill { Name = "User Documentation", DisplayOrder = 2 },
                new Skill { Name = "Test Documentation", DisplayOrder = 3 },
            });

            db.SkillCategories.AddRange(languages, webDev, databases, qa, core, tools, docs);
        }

        if (!db.Experiences.Any())
        {
            db.Experiences.AddRange(
                new Experience
                {
                    JobTitle = "Executive",
                    Company = "Style Textile, Quaid-e-Azam Industry",
                    StartDate = "09/2023",
                    EndDate = "12/2023",
                    IsCurrent = false,
                    DisplayOrder = 1,
                    Published = true,
                    Responsibilities = "<ul><li>Coordinated transportation and logistics for incoming and outgoing shipments, including freight forwarding, cargo insurance, and delivery scheduling.</li><li>Maintained accurate financial and shipping documentation, building strong attention to detail and process discipline directly transferable to QA test documentation and traceability.</li><li>Collaborated across departments to ensure timely operations, strengthening cross-team communication skills.</li></ul>"
                },
                new Experience
                {
                    JobTitle = "Computer Science Teacher",
                    Company = "LAPS School System",
                    StartDate = "03/2022",
                    EndDate = "05/2023",
                    IsCurrent = false,
                    DisplayOrder = 2,
                    Published = true,
                    Responsibilities = "<ul><li>Designed and delivered a curriculum covering programming fundamentals, data structures, and computer systems over two years.</li><li>Applied interactive, technology-driven teaching methods to improve student engagement and comprehension of technical concepts.</li><li>Prepared structured lesson documentation and collaborated with fellow teachers on joint projects, reinforcing planning and communication skills.</li></ul>"
                }
            );
        }

        if (!db.Educations.Any())
        {
            db.Educations.Add(new Education
            {
                Degree = "Bachelor of Science in Information Technology (BSIT)",
                Institution = "University of Education",
                Location = "Lahore, Pakistan",
                StartDate = "2021",
                EndDate = "2025",
                DisplayOrder = 1,
                Published = true
            });
        }

        if (!db.Certifications.Any())
        {
            db.Certifications.AddRange(
                new Certification
                {
                    Title = "Certification of Employability Skills",
                    Issuer = null, // Not stated anywhere in your CV — fill this in via Admin once built. Do NOT guess.
                    IssueDate = "26 April 2025",
                    ExpiryDate = "19 July 2025",
                    Description = "Lahore, Pakistan",
                    DisplayOrder = 1,
                    Published = true
                },
                new Certification
                {
                    Title = "AI Engineer Agentic Track: The Complete Agent & MCP Course",
                    Issuer = "Udemy.com",
                    IssueDate = "In Progress",
                    Description = "In process — covers agentic AI, Model Context Protocol (MCP), and applied AI engineering.",
                    DisplayOrder = 2,
                    Published = true
                }
            );
        }

        db.SaveChanges();
    }
}