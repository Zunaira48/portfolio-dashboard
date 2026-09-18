using PortfolioApi.Dtos;

namespace PortfolioApi.Services;

public interface IGeminiChatService
{
    Task<string> AskAsync(string question, List<ChatTurnDto> history);
}