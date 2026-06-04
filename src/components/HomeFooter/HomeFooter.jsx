import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}

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
          {data.links.map((link) => {
            const className = "home-footer__link";
            if (isInternalHref(link.href)) {
              return (
                <Link key={link.label} to={link.href} className={className}>
                  {link.label}
                </Link>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <p className="home-footer__copy">{data.copyright}</p>
      </div>

      <a
        href="https://hosthaus.co.uk/"
        className="home-footer__credit"
        target="_blank"
        rel="noopener noreferrer"
      >
        Designed by HostHaus Ltd.
      </a>
    </footer>
  );
}
