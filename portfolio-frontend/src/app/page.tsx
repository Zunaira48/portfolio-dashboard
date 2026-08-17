import { api } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default async function Home() {
  const [settings, profile, socialLinks, projects, skills, experience, education, certifications] = await Promise.all([
    api.getSiteSettings(),
    api.getProfile(),
    api.getSocialLinks(),
    api.getProjects(),
    api.getSkills(),
    api.getExperience(),
    api.getEducation(),
    api.getCertifications(),
  ]);

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName} />
      <main>
        <Hero profile={profile} socialLinks={socialLinks} />
        <About profile={profile} settings={settings} />
        <Skills categories={skills} />
        <Projects projects={projects} />
        <Experience items={experience} />
        <Education items={education} />
        <Certifications items={certifications} />
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}
