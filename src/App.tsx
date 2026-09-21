import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEmergency } from './context/EmergencyContext';
import { Navbar } from './components/common/Navbar';
import { LanguageToggle } from './components/common/LanguageToggle';
import { Footer } from './components/common/Footer';
import { DemoToolbar } from './components/common/DemoToolbar';
import { LandingPage } from './components/home/LandingPage';
import { PublicSOSView } from './components/public/PublicSOSView';
import { PublicTrackingView } from './components/public/PublicTrackingView';
import { TrafficPoliceDashboard } from './components/police/TrafficPoliceDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';

const pathToRole: Record<string, 'HOME' | 'PUBLIC' | 'POLICE' | 'GOVERNMENT'> = {
  '/': 'HOME',
  '/public': 'PUBLIC',
  '/police': 'POLICE',
  '/government': 'GOVERNMENT',
};

export const MainContent: React.FC = () => {
 
  const location = useLocation();
  const { activeRole, setActiveRole, currentEmergency } = useEmergency();
const [publicSubView, setPublicSubView] = React.useState<'SOS' | 'TRACKING'>('SOS');

useEffect(() => {
  if (currentEmergency && currentEmergency.status !== 'RESOLVED') {
    setPublicSubView('TRACKING');
  }
}, [currentEmergency?.id]);
  useEffect(() => {
    const role = pathToRole[location.pathname];
    if (role && role !== activeRole) {
      setActiveRole(role);
    }
  }, [location.pathname]);

  const showLanguageToggle = location.pathname === '/' || location.pathname === '/public';

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1f3a] text-white bg-grid-pattern selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {showLanguageToggle && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 flex justify-end">
          <LanguageToggle />
        </div>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/public"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {publicSubView === 'SOS' ? (
                  <PublicSOSView onNavigateToTracking={() => setPublicSubView('TRACKING')} />
                ) : (
                  <PublicTrackingView onBackToSOS={() => setPublicSubView('SOS')} />
                )}
              </div>
            }
          />
          <Route path="/police" element={<TrafficPoliceDashboard />} />
          <Route path="/government" element={<GovernmentDashboard />} />
        </Routes>
      </main>

      <DemoToolbar />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return <MainContent />;
};

export default App;
