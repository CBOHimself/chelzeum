import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Art', to: '/art' },
  { label: 'Events', to: '/events' },
  { label: 'Commissions', to: '/commissions' },
  { label: 'Shop', to: '/shop' },
  { label: 'Social', to: '/social' },
];

const socials = [
  { label: 'TikTok', icon: TikTokIcon, href: '#' },
  { label: 'Instagram', icon: InstagramIcon, href: '#' },
  { label: 'Twitter', icon: TwitterIcon, href: '#' },
];

const navVariants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] },
  },
};

const linkContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const socialContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export default function ChelzeumNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const displayedNavLinks = navLinks.filter((link) => link.to !== '/works');

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="menu-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed top-6 right-8 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
              className="group flex items-center gap-2 text-[#F4EDE5] tracking-[0.35em] text-xs font-medium uppercase"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block w-5 h-px bg-[#F4EDE5] transition-all duration-300 group-hover:w-7" />
                <span className="block w-3 h-px bg-[#784247] transition-all duration-300 group-hover:w-7" />
              </span>
              Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="nav-bar"
            variants={navVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Main navigation"
            className="fixed top-12 left-12 right-12 md:top-6 md:left-8 md:right-8 z-50 px-8 md:px-12 py-10 backdrop-blur-md bg-[#0D1B2A]/60 border border-[#784247]/30 rounded-2xl"
            style={{
              boxShadow: '0 4px 60px rgba(13,27,42,0.6), inset 0 1px 0 rgba(244,237,229,0.04)',
            }}
          >
            <div className="flex items-center justify-between w-full">
              <motion.div variants={linkVariants}>
                <Link
                  to="/"
                  className="text-2xl md:text-3xl text-[#F4EDE5] tracking-[0.18em] uppercase font-serif transition-all duration-300 hover:italic hover:text-[#784247]"
                >
                  Chelzeum
                </Link>
              </motion.div>

              <motion.ul
                variants={linkContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="hidden md:flex items-center gap-10 list-none m-0 p-0"
              >
                {displayedNavLinks.map((link) => (
                  <motion.li key={link.to} variants={linkVariants}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `relative inline-flex py-3 tracking-[0.22em] text-xs font-medium uppercase transition-colors duration-300 group ${
                          isActive ? 'text-[#F4EDE5]' : 'text-[#F4EDE5]/85 hover:text-[#F4EDE5]'
                        }`
                      }
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#784247] transition-all duration-300 group-hover:w-full" />
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex items-center gap-6">
                <motion.div
                  variants={socialContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="hidden sm:flex items-center gap-5"
                >
                  {socials.map(({ label, icon: Icon, href }) => (
                    <motion.a
                      key={label}
                      variants={socialVariants}
                      href={href}
                      aria-label={label}
                      className="text-[#F4EDE5]/60 hover:text-[#784247] transition-colors duration-300"
                    >
                      <Icon />
                    </motion.a>
                  ))}
                </motion.div>

                <motion.span variants={linkVariants} className="hidden sm:block w-px h-5 bg-[#784247]/40" />

                <motion.button
                  variants={linkVariants}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation"
                  className="group flex items-center gap-2 py-3 text-[#F4EDE5]/70 tracking-[0.3em] text-xs font-medium uppercase hover:text-[#F4EDE5] transition-colors duration-300"
                >
                  Close
                  <span className="relative w-4 h-4">
                    <span className="absolute top-1/2 left-0 w-full h-px bg-current rotate-45 -translate-y-1/2 transition-transform duration-300 group-hover:rotate-135" />
                    <span className="absolute top-1/2 left-0 w-full h-px bg-current -rotate-45 -translate-y-1/2 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </motion.button>
              </div>
            </div>

            <motion.ul
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex md:hidden flex-col gap-5 mt-8 pb-2 list-none p-0"
            >
              {displayedNavLinks.map((link) => (
                <motion.li key={link.to} variants={linkVariants}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `inline-flex py-2 tracking-[0.25em] text-sm font-medium uppercase transition-colors duration-300 ${
                        isActive ? 'text-[#F4EDE5]' : 'text-[#F4EDE5]/85 hover:text-[#784247]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}

              <motion.li variants={linkVariants} className="flex gap-5 pt-2">
                {socials.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-[#F4EDE5]/50 hover:text-[#784247] transition-colors duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}