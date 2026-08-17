using System.Threading.Tasks;

namespace PortfolioApi.Services
{
    public interface IEmailService
    {
        Task SendContactMessageAsync(string fromName, string fromEmail, string message);
    }
}