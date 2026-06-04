import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ChelzeumNav from '../components/nav/navBar';
import SignupPopup from '../components/SignupPopup/SignupPopup';

const STATIC_PAGE_TITLES = {
  '/': 'Home',
  '/art': 'Artworks',
  '/events': 'Events',
  '/bio': 'Bio',
  '/social': 'Social',
};

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    if (pathname.startsWith('/events/')) return;
    const page = STATIC_PAGE_TITLES[pathname] ?? STATIC_PAGE_TITLES['/'];
    document.title = `Chelzeum — ${page}`;
  }, [location.pathname]);

  return (
    <>
      <ChelzeumNav />
      <main>
        <Outlet />
      </main>
      <SignupPopup />
    </>
  );
}
