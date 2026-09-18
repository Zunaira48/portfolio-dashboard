import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ChatWidget from "@/components/ChatWidget";
import TerminalEasterEgg from "@/components/TerminalEasterEgg";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-dashboard-six-omega.vercel.app"),
  title: "Zunaira Zahid — Software Engineer & QA Engineer",
  description:
    "Portfolio of Zunaira Zahid — Software Engineer, QA Engineer, and Information Technology professional specializing in ASP.NET Core, C#, and software quality assurance.",
  openGraph: {
    title: "Zunaira Zahid — Software Engineer & QA Engineer",
    description: "Portfolio showcasing projects, skills, and experience in software development and QA.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
        <ScrollToTop />
        <ChatWidget />
        <TerminalEasterEgg />
        <Analytics />
      </body>
    </html>
  );
}