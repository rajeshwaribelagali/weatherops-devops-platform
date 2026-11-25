import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { WeatherDashboardPage } from './pages/WeatherDashboardPage';
import { DevOpsControlCenterPage } from './pages/DevOpsControlCenterPage';
import { InfrastructureMonitoringPage } from './pages/InfrastructureMonitoringPage';
import { ObservabilityCenterPage } from './pages/ObservabilityCenterPage';
import { DevOpsRunbookModal } from './components/devops/DevOpsRunbookModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('weather');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isRunbookOpen, setIsRunbookOpen] = useState<boolean>(false);

  const weatherState = useWeather();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'weather':
        return <WeatherDashboardPage weatherState={weatherState} />;
      case 'devops':
        return <DevOpsControlCenterPage />;
      case 'infra':
        return <InfrastructureMonitoringPage />;
      case 'observability':
        return <ObservabilityCenterPage />;
      default:
        return <WeatherDashboardPage weatherState={weatherState} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        activeTab={activeTab}
        unit={weatherState.unit}
        onToggleUnit={weatherState.toggleUnit}
        onRefresh={weatherState.refreshWeather}
        onOpenRunbook={() => setIsRunbookOpen(true)}
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenRunbook={() => setIsRunbookOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {renderActivePage()}
        </main>
      </div>

      {isRunbookOpen && (
        <DevOpsRunbookModal onClose={() => setIsRunbookOpen(false)} />
      )}
    </div>
  );
}