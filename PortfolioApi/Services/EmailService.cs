using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace PortfolioApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendContactMessageAsync(string fromName, string fromEmail, string message)
        {
            var senderEmail = _config["EmailSettings:SenderEmail"]
                ?? throw new InvalidOperationException("EmailSettings:SenderEmail is missing in configuration.");
            var senderName = _config["EmailSettings:SenderName"]
                ?? throw new InvalidOperationException("EmailSettings:SenderName is missing in configuration.");
            var senderPassword = _config["EmailSettings:SenderPassword"]
                ?? throw new InvalidOperationException("EmailSettings:SenderPassword is missing. Set it via 'dotnet user-secrets set EmailSettings:SenderPassword \"yourapppassword\"'.");
            var smtpServer = _config["EmailSettings:SmtpServer"]
                ?? throw new InvalidOperationException("EmailSettings:SmtpServer is missing in configuration.");
            var smtpPortRaw = _config["EmailSettings:SmtpPort"]
                ?? throw new InvalidOperationException("EmailSettings:SmtpPort is missing in configuration.");

            if (!int.TryParse(smtpPortRaw, out var smtpPort))
            {
                throw new InvalidOperationException($"EmailSettings:SmtpPort value '{smtpPortRaw}' is not a valid number.");
            }

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(new MailboxAddress(senderName, senderEmail));
            email.ReplyTo.Add(new MailboxAddress(fromName, fromEmail));
            email.Subject = $"Portfolio Contact — message from {fromName}";

            email.Body = new TextPart("plain")
            {
                Text = $"From: {fromName} ({fromEmail})\n\n{message}"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, senderPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}