"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi, type AdminMediaAsset } from "@/lib/adminApi";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Loader2, Upload, Trash2, Copy, Check , FileText} from "lucide-react";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<AdminMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<AdminMediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setAssets(await adminApi.getMedia());
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAssets(await adminApi.getMedia());
      setLoading(false);
    })();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await adminApi.uploadMedia(file, file.name);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Only JPEG, PNG, and WEBP images under 5MB are allowed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function copyUrl(asset: AdminMediaAsset) {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleDelete() {
    if (!deleting) return;
    await adminApi.deleteMedia(deleting.id);
    setDeleting(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Media</h1>
      <p className="text-text-muted text-sm mb-6">
        Upload images, then copy their URL into a Project, Certification, or your Profile.
      </p>

      <div className="card p-6 mb-8 text-center border-dashed">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm"
          onChange={handleFileChange}
          className="hidden"
          id="media-upload-input"
        />
        <label htmlFor="media-upload-input" className="cursor-pointer inline-flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center">
            {uploading ? <Loader2 size={20} className="animate-spin text-accent" /> : <Upload size={20} className="text-accent" />}
          </div>
          <span className="text-sm font-semibold">{uploading ? "Uploading..." : "Click to upload a file"}</span>
          <span className="text-xs text-text-muted">JPEG, PNG, WEBP, PDF (max 5MB), or MP4/WEBM video (max 20MB)</span>
        </label>
      </div>

      {error ? <p className="text-red-500 text-sm px-3 py-2 rounded-lg bg-red-500/10 mb-6 max-w-md">{error}</p> : null}

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : assets.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="card overflow-hidden">
              {asset.type === "document" ? (
                <div className="w-full h-32 flex items-center justify-center bg-bg-soft">
                  <FileText size={32} className="text-text-muted" />
                </div>
              ) : asset.type === "video" ? (
                <video src={asset.url} muted loop autoPlay playsInline className="w-full h-32 object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.altText ?? ""} className="w-full h-32 object-cover" />
              )}
              <div className="p-3">
                <p className="text-xs text-text-muted truncate mb-2">{asset.altText || "Untitled"}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyUrl(asset)}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border border-border hover:border-accent transition-colors"
                  >
                    {copiedId === asset.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === asset.id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => setDeleting(asset)}
                    aria-label="Delete"
                    className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting ? (
        <ConfirmDialog
          message="Delete this image? It will also be removed from Cloudinary."
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </div>
  );
}