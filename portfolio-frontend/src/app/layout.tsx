import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  );
}