using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Dtos;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers.Public;

[ApiController]
[Route("api/chatbot")]
public class ChatbotController : ControllerBase
{
    private readonly IGeminiChatService _chat;

    // Simple in-memory per-IP rate limit: protects the shared Gemini free-tier
    // quota from a single visitor (or bot) exhausting it for everyone else.
    private static readonly ConcurrentDictionary<string, (int Count, DateTime WindowStart)> _rateLimits = new();
    private const int MaxRequestsPerWindow = 6;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);

    public ChatbotController(IGeminiChatService chat) => _chat = chat;

    [HttpPost("ask")]
    public async Task<ActionResult<ChatResponseDto>> Ask([FromBody] ChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest(new { message = "Ask me something about Zunaira's work!" });

        if (dto.Message.Length > 400)
            return BadRequest(new { message = "Keep it under 400 characters, please." });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        if (IsRateLimited(ip))
            return StatusCode(429, new { message = "That's a lot of questions at once — give it about a minute and try again." });

        var history = (dto.History ?? new List<ChatTurnDto>()).TakeLast(6).ToList();
        var reply = await _chat.AskAsync(dto.Message.Trim(), history);
        return Ok(new ChatResponseDto { Reply = reply });
    }

    private static bool IsRateLimited(string ip)
    {
        var now = DateTime.UtcNow;
        var entry = _rateLimits.AddOrUpdate(ip,
            _ => (1, now),
            (_, existing) => now - existing.WindowStart > Window ? (1, now) : (existing.Count + 1, existing.WindowStart));
        return entry.Count > MaxRequestsPerWindow;
    }
}