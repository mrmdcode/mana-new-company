import Hero from "@/components/home/Hero";
import ServicesIntro from "@/components/home/ServicesIntro";
import Partners from "@/components/home/Partners";
import Scenarios from "@/components/home/Scenarios";
import Roadmap from "@/components/home/Roadmap";
import ServicesPortfolio from "@/components/home/ServicesPortfolio";
import Newsletter from "@/components/home/Newsletter";
import BlogPreview from "@/components/home/BlogPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <Partners />
      <Scenarios />
      <Roadmap />
      <ServicesPortfolio />
      <Newsletter />
      <BlogPreview />
    </>
  );
}
