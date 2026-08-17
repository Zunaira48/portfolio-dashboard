using Google.Apis.Auth;

namespace PortfolioApi.Services;

public interface IGoogleAuthService
{
    Task<GoogleJsonWebSignature.Payload?> VerifyIdTokenAsync(string idToken);
}