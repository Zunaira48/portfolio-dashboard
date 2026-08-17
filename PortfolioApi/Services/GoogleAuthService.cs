using Google.Apis.Auth;

namespace PortfolioApi.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly string _clientId;
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(IConfiguration config, ILogger<GoogleAuthService> logger)
    {
        _clientId = config["GoogleAuth:ClientId"]
            ?? throw new InvalidOperationException("GoogleAuth:ClientId is not configured.");
        _logger = logger;
    }

    // Cryptographically validates the token against Google's public keys and
    // checks it was issued for OUR client ID. This is the real security boundary —
    // nothing here trusts anything the frontend claims about the user.
    public async Task<GoogleJsonWebSignature.Payload?> VerifyIdTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _clientId }
            };
            return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Rejected an invalid Google ID token during admin login attempt.");
            return null;
        }
    }
}