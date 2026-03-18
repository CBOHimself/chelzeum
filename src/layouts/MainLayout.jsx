import { Outlet } from 'react-router-dom';
import ChelzeumNav from '../components/nav/navBar';

export default function MainLayout() {
  return (
    <>
      <ChelzeumNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
