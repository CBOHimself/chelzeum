import { motion } from "framer-motion";

const education = [
  {
    year: "2021",
    title: "MSc Social Research Methods",
    subtitle: "Distinction, London School of Economics and Political Science",
  },
  {
    year: "2020",
    title: "BA Politics and International Relations",
    subtitle: "First Class Honours, University of Nottingham",
  },
];

const exhibitions = [
  {
    year: "2025",
    title: "SHIFT: Break Pattern, Build Perspective",
    detail:
      "Printed in Colour, London. Exhibited My Father's Daughter (2024) and EVE (2022).",
  },
  {
    year: "2024",
    title: "Round the Fire Stories",
    detail: "FirePit Gallery, London. Curated by Curtis Donovan. Exhibited True 2 Self.",
  },
  {
    year: "2023",
    title: "Painting Open",
    detail: "No Format Gallery, London. Exhibited What the Heart Wants (2023), sold for £333.",
  },
  {
    year: "2022",
    title: "Painting Open",
    detail:
      "No Format Gallery, London. Exhibited Waiting for My Love to Come Home (2022).",
  },
];

const workshops = [
  {
    year: "2024",
    title: "Burson Roots",
    detail:
      "Black History Month Sip and Paint: Reclaiming Narratives. Led creative workshop.",
  },
  {
    year: "2023",
    title: "Burson Roots",
    detail: "Black History Month Sip and Paint: Reclaiming Narratives.",
  },
  {
    year: "2022",
    title: "Sip and Paint Workshop",
    detail: "Republic Bar and Grill, Ghana.",
  },
];

const collections = [
  "P. Haringsma: Study of a Body (2019).",
  "S. Shaw: The Flower that Blooms in a Dark Room (2023).",
  "J. and S. Morris: Planets Collide (2023), private collection, South of France.",
  "Printed in Colour: Forcing Orchids (2024), Second Anniversary Gala.",
];

const skills = [
  "Painting",
  "Concept development",
  "Visual storytelling",
  "Workshop facilitation",
  "Commissioned work",
  "Collaborative practice",
];

function Timeline({ heading, items }) {
  return (
    <section className="bio-section">
      <h2 className="bio-section__title">{heading}</h2>
      <div className="bio-timeline">
        {items.map((item) => (
          <article key={`${item.year}-${item.title}`} className="bio-timeline__item">
            <div className="bio-timeline__year">{item.year}</div>
            <div className="bio-timeline__content">
              <h3 className="bio-timeline__title">{item.title}</h3>
              <p className="bio-timeline__detail">{item.subtitle ?? item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Bio() {
  return (
    <motion.main
      className="bio-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="bio-hero">
        <div className="bio-hero__copy">
          <p className="art-page-count">Chelsea Sapphire Oware</p>
          <h1 className="art-page-title">Bio</h1>
          <p className="bio-hero__subtitle">Ghanaian Fine Artist | East London, UK</p>
          <p className="bio-hero__meta">Email: chelzeum@gmail.com</p>
          <p className="bio-hero__meta">Website: www.chelzeum.net</p>
          <p className="bio-hero__meta">Instagram: instagram.com/chelzeum</p>
        </div>
        <div className="bio-hero__image-placeholder" role="img" aria-label="Artist portrait placeholder">
          <span>Image Placeholder</span>
        </div>
      </header>

      <section className="bio-section">
        <h2 className="bio-section__title">Profile</h2>
        <p className="bio-section__text">
          I am a Ghanaian self taught fine artist living and working in East London.
          My practice explores themes of identity, femininity, and the concepts of time
          and perspective. Through painting, I examine personal and collective narratives,
          inviting reflection on memory, subjectivity and lived experience.
        </p>
      </section>

      <Timeline heading="Education" items={education} />
      <Timeline heading="Exhibitions and Shows" items={exhibitions} />

      <section className="bio-section">
        <h2 className="bio-section__title">Open Studios</h2>
        <p className="bio-section__text">
          Participated in two open studio events in London.
        </p>
        <div className="bio-image-row">
          <div className="bio-image-placeholder" />
          <div className="bio-image-placeholder" />
        </div>
      </section>

      <Timeline heading="Events and Workshops" items={workshops} />

      <section className="bio-section">
        <h2 className="bio-section__title">Commissions</h2>
        <p className="bio-section__text">
          Odgers Berndtson x Cancer Research UK. Facilitated commissioned original artwork
          for S. Shaw and J. Morris.
        </p>
      </section>

      <section className="bio-section">
        <h2 className="bio-section__title">Collections</h2>
        <ul className="bio-list">
          {collections.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="bio-section">
        <h2 className="bio-section__title">Social Impact and Donations</h2>
        <p className="bio-section__text">
          Donated artworks to a BAME Creative Empowerment social enterprise.
        </p>
      </section>

      <section className="bio-section">
        <h2 className="bio-section__title">Skills</h2>
        <div className="bio-skill-tags">
          {skills.map((skill) => (
            <span key={skill} className="bio-skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="bio-section">
        <h2 className="bio-section__title">References</h2>
        <p className="bio-section__text">Available on request.</p>
      </section>
    </motion.main>
  );
}
