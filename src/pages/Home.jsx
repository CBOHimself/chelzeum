import homeData from "../data/home.json";
import HomeHero from "../components/HomeHero/HomeHero";
import HomeNarrative from "../components/HomeNarrative/HomeNarrative";
import HomePhilosophy from "../components/HomePhilosophy/HomePhilosophy";
import HomeFooter from "../components/HomeFooter/HomeFooter";

export default function Home() {
  return (
    <>
      <div className="home-main">
        <HomeHero data={homeData.hero} />
        <HomeNarrative data={homeData.narrative} />
        <HomePhilosophy
          philosophy={homeData.philosophy}
          gallery={homeData.gallery}
        />
      </div>
      <HomeFooter data={homeData.footer} />
    </>
  );
}
