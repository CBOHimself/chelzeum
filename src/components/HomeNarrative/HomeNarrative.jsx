import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomeNarrative({ data }) {
  const aspectPct = (
    (data.image.aspectH / data.image.aspectW) *
    100
  ).toFixed(2);

  return (
    <section className="home-narrative" aria-label="Artist narrative">
      <div className="home-narrative__bg-accent" aria-hidden="true" />

      <div className="home-narrative__inner">
        <motion.div
          className="home-narrative__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <h2 className="home-narrative__heading">A Study in Contrast</h2>
          <div className="home-narrative__rule" aria-hidden="true" />
        </motion.div>

        <div className="home-narrative__cols">
          <motion.div
            className="home-narrative__quote-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="home-narrative__process-label">
              {data.processLabel}
            </span>
            <blockquote className="home-narrative__quote">
              {data.pullQuote}
            </blockquote>
          </motion.div>

          <motion.div
            className="home-narrative__img-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <div className="home-narrative__img-wrap">
              <div
                className="home-narrative__img-ratio"
                style={{ paddingBottom: `${aspectPct}%` }}
              >
                <div className="home-narrative__img-inner">
                  {data.image.src ? (
                    <img
                      src={data.image.src}
                      alt={data.image.alt}
                      className="home-narrative__img"
                    />
                  ) : (
                    <div className="home-narrative__img-placeholder" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
