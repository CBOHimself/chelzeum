import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

const imgFade = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: (d = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

const COLUMNS = [
  [0, 1],
  [2, 3],
  [4],
];

export default function HomePhilosophy({ philosophy, gallery }) {
  return (
    <section className="home-philosophy" aria-label="Artistic philosophy">
      <div className="home-philosophy__inner">
        <motion.div
          className="home-philosophy__text-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="home-philosophy__heading"
            variants={fadeUp}
            custom={0}
          >
            {philosophy.heading}
          </motion.h2>
          <motion.p
            className="home-philosophy__body"
            variants={fadeUp}
            custom={0.1}
          >
            {philosophy.body}
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2}>
            <Link
              to={philosophy.ctaHref}
              className="home-philosophy__cta group"
              aria-label={philosophy.cta}
            >
              <span className="home-philosophy__cta-text">{philosophy.cta}</span>
              <span className="home-philosophy__cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <div className="home-philosophy__gallery">
          {COLUMNS.map((colIndices, colIdx) => (
            <div
              key={colIdx}
              className={`home-philosophy__gallery-col ${
                colIdx === 2 ? "home-philosophy__gallery-col--hidden-sm" : ""
              } ${colIdx === 1 ? "home-philosophy__gallery-col--offset" : ""}`}
            >
              {colIndices.map((imgIdx, rowIdx) => {
                const img = gallery[imgIdx];
                if (!img) return null;
                const aspectPct = ((img.aspectH / img.aspectW) * 100).toFixed(2);
                return (
                  <motion.div
                    key={imgIdx}
                    className="home-philosophy__gallery-item"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={imgFade}
                    custom={colIdx * 0.1 + rowIdx * 0.07}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    <div
                      className="home-philosophy__gallery-ratio"
                      style={{ paddingBottom: `${aspectPct}%` }}
                    >
                      <div className="home-philosophy__gallery-img-wrap">
                        {img.src ? (
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="home-philosophy__gallery-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="home-philosophy__gallery-placeholder" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
