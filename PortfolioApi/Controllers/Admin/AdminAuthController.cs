using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Dtos;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers.Admin;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IGoogleAuthService _googleAuth;
    private readonly IConfiguration _config;
    private readonly ILogger<AdminAuthController> _logger;

    public AdminAuthController(IGoogleAuthService googleAuth, IConfiguration config, ILogger<AdminAuthController> logger)
    {
        _googleAuth = googleAuth;
        _config = config;
        _logger = logger;
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify([FromBody] VerifyTokenRequest request)
    {
        var payload = await _googleAuth.VerifyIdTokenAsync(request.IdToken);

        if (payload is null)
            return Unauthorized(new { message = "Invalid Google token." });

        var adminEmail = _config["AdminSettings:AdminEmail"]
            ?? throw new InvalidOperationException("AdminSettings:AdminEmail is not configured.");

        // The ONLY place identity is decided. Case-insensitive, exact match against
        // server-side config — never a value supplied by the frontend.
        bool isAuthorizedAdmin =
            payload.EmailVerified &&
            string.Equals(payload.Email, adminEmail, StringComparison.OrdinalIgnoreCase);

        if (!isAuthorizedAdmin)
        {
            _logger.LogWarning("Rejected admin login attempt from unauthorized email {Email}.", payload.Email);
            return Forbid();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, payload.Email),
            new(ClaimTypes.Name, payload.Name ?? payload.Email),
            new(ClaimTypes.Role, "Admin")
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

        return Ok(new AdminSessionDto { Email = payload.Email, Name = payload.Name });
    }

    [HttpGet("me")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Me()
    {
        var email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var name = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new AdminSessionDto { Email = email, Name = name });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logged out." });
    }
}