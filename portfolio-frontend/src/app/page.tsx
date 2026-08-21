import { api } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import ConnectCTA from "@/components/ConnectCTA";
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
        <FeaturedProjects projects={projects} />
        <Experience items={experience} />
        <Education items={education} />
        <Certifications items={certifications} />
        <ConnectCTA />
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}
