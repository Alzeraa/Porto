import { useLocationStore } from '../store/locationStore';
import HomePage from '../pages/HomePage';
import FAQPage from '../pages/FAQPage';
import AdminPage from '../pages/AdminPage';
import ServicesPage from '../pages/ServicesPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';

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

  if (pathname === '/services') {
    return <ServicesPage />;
  }

  if (pathname.startsWith('/projects/')) {
    const id = pathname.split('/projects/')[1];
    return <ProjectDetailPage projectId={id} />;
  }

  if (pathname === '/projects') {
    return <ProjectsPage />;
  }

  if (pathname === '/contact') {
    return <ContactPage />;
  }

  if (pathname === '/about') {
    return <AboutPage />;
  }

  return <HomePage />;
};

export default AppRoutes;
