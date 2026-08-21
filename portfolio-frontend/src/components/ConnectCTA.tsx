import Link from "next/link";
import Reveal from "./Reveal";
import { Mail, ArrowRight } from "lucide-react";

export default function ConnectCTA() {
  return (
    <section id="contact" className="py-12 md:py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <div className="card p-8 sm:p-12">
            <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-5">
              <Mail size={22} className="text-accent" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Let&apos;s Connect</h2>
            <p className="text-text-muted mb-7 max-w-md mx-auto">
              Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Get In Touch <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}