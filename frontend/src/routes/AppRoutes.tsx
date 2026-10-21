import { useLocationStore } from '../store/locationStore';
import HomePage from '../pages/HomePage';
import FAQPage from '../pages/FAQPage';
import AdminPage from '../pages/AdminPage';

interface AppRoutesProps {
  darkMode: boolean;
}

const AppRoutes = ({ darkMode }: AppRoutesProps) => {
  const { pathname } = useLocationStore();

  if (pathname === '/erynalva' || pathname.startsWith('/erynalva/')) {
    return <AdminPage />;
  }

  if (pathname === '/faq') {
    return <FAQPage darkMode={darkMode} />;
  }

  return <HomePage />;
};

export default AppRoutes;
