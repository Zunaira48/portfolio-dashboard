import { api } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export default async function BlogPage() {
  const [settings, profile, socialLinks, posts] = await Promise.all([
    api.getSiteSettings(),
    api.getProfile(),
    api.getSocialLinks(),
    api.getBlogPosts(),
  ]);

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName} />
      <main className="max-w-6xl mx-auto px-6 py-20 md:py-28 min-h-[60vh]">
        <Reveal>
          <SectionHeading eyebrow="Blog" title="Writing" description="Thoughts on development, testing, and building this portfolio." />
        </Reveal>

        {posts.length === 0 ? (
          <p className="text-text-muted text-sm">No posts published yet — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 60}>
                <Link href={`/blog/${post.slug}`} className="card overflow-hidden flex flex-col h-full hover:border-accent transition-colors">
                  {post.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-40 object-cover" />
                  ) : null}
                  <div className="p-5 flex flex-col flex-1">
                    {post.publishedAt ? (
                      <p className="text-xs text-text-muted mb-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
                    ) : null}
                    <h3 className="font-display font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed flex-1">{post.excerpt}</p>
                    {post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="badge">{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}