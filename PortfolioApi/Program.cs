using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using PortfolioApi.Data;
using PortfolioApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Render (and most container platforms) assign a port via the PORT env var
// at runtime — only override Kestrel's binding when that variable is actually
// present, so local dev keeps using launchSettings.json's port (5216) unchanged.
var containerPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(containerPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{containerPort}");
}

// --- Database (Neon Postgres via EF Core) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection is missing. Set it via " +
        "'dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" \"your-neon-connection-string\"'.");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// --- CORS: locked to known frontend origins only, never AllowAnyOrigin ---
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000", "http://localhost:5216" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()); // required so the admin session cookie is sent cross-origin
});

// --- Cookie authentication (HttpOnly, not accessible to JS — protects against XSS token theft) ---
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "portfolio_admin_session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;

        // This is an API, not an MVC app — never redirect to an HTML login page.
        // Return plain status codes instead so the frontend can react in JS.
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireClaim(System.Security.Claims.ClaimTypes.Role, "Admin"));
});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Admin endpoints return EF entities directly (Project -> Technologies -> Project -> ...).
        // IgnoreCycles breaks the loop by omitting the back-reference instead of throwing.
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

// DEV-ONLY: serves a single static test page so we can exercise real Google
// Sign-In before the Next.js frontend exists. Not present in production.
if (app.Environment.IsDevelopment())
{
    var devToolsPath = Path.Combine(app.Environment.ContentRootPath, "DevTools");
    if (Directory.Exists(devToolsPath))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(devToolsPath),
            RequestPath = "/dev-tools"
        });
    }
}

app.MapControllers();
app.MapGet("/error", () => Results.Problem("An unexpected error occurred."));
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DataSeeder.Seed(db);
}

app.Run();