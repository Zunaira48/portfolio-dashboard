namespace PortfolioApi.Dtos;

public class ChatTurnDto
{
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Text { get; set; } = string.Empty;
}

public class ChatRequestDto
{
    public string Message { get; set; } = string.Empty;
    public List<ChatTurnDto>? History { get; set; }
}

public class ChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
}