import { api } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [settings, profile, socialLinks] = await Promise.all([
    api.getSiteSettings(),
    api.getProfile(),
    api.getSocialLinks(),
  ]);

  let post;
  try {
    post = await api.getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName} />
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-8" />
        ) : null}

        {post.publishedAt ? (
          <p className="text-sm text-text-muted mb-3">{new Date(post.publishedAt).toLocaleDateString()}</p>
        ) : null}

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

        <div className="text-text-muted text-lg leading-relaxed whitespace-pre-line mb-8">
          {post.content}
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
            {post.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>
        ) : null}
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}