import { getCertificates, getProjects, getSettings } from "@/lib/data";
import { SoundProvider } from "@/components/SoundProvider";
import CursorFX from "@/components/CursorFX";
import NeuralBackground from "@/components/NeuralBackground";
import BootScreen from "@/components/BootScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Works from "@/components/Works";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [s, projects, certs] = await Promise.all([getSettings(), getProjects(), getCertificates()]);

  return (
    <SoundProvider>
      <NeuralBackground />
      <CursorFX />
      <BootScreen />
      <Navbar name={s.nameEn} />
      <main>
        <Hero
          name={s.name}
          nameEn={s.nameEn}
          title={s.title}
          stats={[
            { label: "سنوات خبرة", value: s.yearsExp },
            { label: "مشروع منجز", value: s.projectsCount },
            { label: "نموذج مدرّب", value: s.modelsCount },
          ]}
        />
        <About
          avatar={s.avatar}
          name={s.name}
          nameEn={s.nameEn}
          title={s.title}
          bio={s.bio}
          location={s.location}
          email={s.email}
        />
        <Skills />
        <Works projects={projects} />
        <Certificates certs={certs} />
        <Contact email={s.email} />
      </main>
      <Footer name={s.name} nameEn={s.nameEn} />
    </SoundProvider>
  );
}
