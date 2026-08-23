"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminContactMessage } from "@/lib/adminApi";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Loader2, Mail, MailOpen, Trash2, Search, Reply } from "lucide-react";

function buildReplyMailto(msg: AdminContactMessage) {
  const subject = msg.subject ? `Re: ${msg.subject}` : "Re: Your message";
  const body = `Hi ${msg.name},\n\n\n\n---\nOn ${new Date(msg.createdAt).toLocaleString()}, you wrote:\n${msg.message}`;
  return `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [deleting, setDeleting] = useState<AdminContactMessage | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setMessages(await adminApi.getContactMessages(search || undefined, unreadOnly || undefined));
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMessages(await adminApi.getContactMessages(search || undefined, unreadOnly || undefined));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await load();
  }

  async function toggleRead(msg: AdminContactMessage) {
    await adminApi.markMessageRead(msg.id, !msg.isRead);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await adminApi.deleteMessage(deleting.id);
    setDeleting(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Contact Messages</h1>
      <p className="text-text-muted text-sm mb-6">Messages submitted through your public contact form.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-60">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, message..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
            />
          </div>
          <button type="submit" className="btn-secondary text-sm px-4">
            Search
          </button>
        </form>

        <button
          onClick={() => setUnreadOnly((v) => !v)}
          className={
            unreadOnly
              ? "px-4 py-2 rounded-full text-sm font-semibold bg-accent text-white"
              : "px-4 py-2 rounded-full text-sm font-semibold border border-border text-text-muted hover:text-text"
          }
        >
          Unread only
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : messages.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No messages found.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.isRead ? "card p-5" : "card p-5 border-accent"}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead ? <span className="w-2 h-2 rounded-full bg-accent shrink-0" /> : null}
                    <p className="font-semibold text-sm">{msg.name}</p>
                    <span className="text-xs text-text-muted">{msg.email}</span>
                  </div>
                  {msg.subject ? <p className="text-sm text-text-muted mb-1">{msg.subject}</p> : null}
                  <p className="text-xs text-text-muted">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleRead(msg)}
                    aria-label={msg.isRead ? "Mark unread" : "Mark read"}
                    className="p-1.5 rounded-md hover:bg-accent-soft hover:text-accent transition-colors"
                  >
                    {msg.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={() => setDeleting(msg)}
                    aria-label="Delete"
                    className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                  className="text-xs text-accent font-semibold"
                >
                  {expanded === msg.id ? "Hide message" : "View message"}
                </button>

                <a
                  href={buildReplyMailto(msg)}
                  className="text-xs text-accent font-semibold inline-flex items-center gap-1"
                >
                  <Reply size={13} /> Reply by Email
                </a>
              </div>

              {expanded === msg.id ? (
                <p className="text-sm text-text-muted mt-2 leading-relaxed whitespace-pre-line border-t border-border pt-3">
                  {msg.message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {deleting ? (
        <ConfirmDialog
          message="Delete this message? This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </div>
  );
}