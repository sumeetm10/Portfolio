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
import CinematicIntro from "@/components/CinematicIntro";
import ChapterDivider from "@/components/ChapterDivider";
import StoryRail from "@/components/StoryRail";
import { getRecentPosts } from "@/lib/blog";

// The page reads as a three-act story:
//   Opening title → Prologue (Hero)
//   Act I   — The Person       (About, Skills, Experience)
//   Act II  — The Work         (Projects, Writing)
//   Act III — The Partnership  (Approach, Services)
//   Epilogue                   (Contact)
export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <main>
      <CinematicIntro />
      <StoryRail />

      <Hero />

      <ChapterDivider
        id="act-1"
        act="Act I"
        numeral="I"
        title="The Person"
        sub="Who's behind the keyboard"
      />
      <About />
      <Skills />
      <Experience />

      <ChapterDivider
        id="act-2"
        act="Act II"
        numeral="II"
        title="The Work"
        sub="Proof over promises"
      />
      <Projects />
      <Writing posts={recentPosts} />

      <ChapterDivider
        id="act-3"
        act="Act III"
        numeral="III"
        title="The Partnership"
        sub="What working together actually looks like"
      />
      <Approach />
      <Services />

      <Contact />
      <Footer />
    </main>
  );
}
