import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Writing from "@/components/Writing";
import Approach from "@/components/Approach";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getRecentPosts } from "@/lib/blog";

export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Writing posts={recentPosts} />
      <Approach />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
