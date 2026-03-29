import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export default function HomeHero({ data }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const aspectPct = ((data.image.aspectH / data.image.aspectW) * 100).toFixed(2);

  return (
    <section
      ref={sectionRef}
      className="home-hero"
      aria-label="Hero — artist identity"
    >
      <motion.div
        className="home-hero__img-col"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <div className="home-hero__img-frame">
          <div className="home-hero__img-border" aria-hidden="true" />
          <div
            className="home-hero__img-ratio"
            style={{ paddingBottom: `${aspectPct}%` }}
          >
            <motion.div
              className="home-hero__img-inner"
              style={{ scale: imgScale }}
            >
              {data.image.src ? (
                <img
                  src={data.image.src}
                  alt={data.image.alt}
                  className="home-hero__img"
                />
              ) : (
                <div className="home-hero__img-placeholder" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="home-hero__text-col"
        style={{ y: textY }}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className="home-hero__eyebrow"
          variants={fadeUp}
          custom={0.15}
        >
          {data.eyebrow}
        </motion.span>

        <motion.h1
          className="home-hero__heading"
          variants={fadeUp}
          custom={0.25}
        >
          {data.heading1}
          <br />
          <span className="home-hero__heading-accent">{data.heading2}</span>
        </motion.h1>

        <motion.div
          className="home-hero__divider"
          variants={fadeUp}
          custom={0.35}
          aria-hidden="true"
        />

        <motion.p className="home-hero__bio" variants={fadeUp} custom={0.4}>
          {data.bio1}
        </motion.p>
        <motion.p className="home-hero__bio" variants={fadeUp} custom={0.48}>
          {data.bio2}
        </motion.p>
      </motion.div>
    </section>
  );
}
