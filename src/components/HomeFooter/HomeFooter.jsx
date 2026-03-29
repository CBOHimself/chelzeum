import { motion } from "framer-motion";

export default function HomeFooter({ data }) {
  return (
    <footer className="home-footer">
      <div className="home-footer__inner">
        <motion.div
          className="home-footer__wordmark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          CHELZEUM
        </motion.div>

        <nav className="home-footer__links" aria-label="Footer navigation">
          {data.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="home-footer__link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="home-footer__copy">{data.copyright}</p>
      </div>
    </footer>
  );
}