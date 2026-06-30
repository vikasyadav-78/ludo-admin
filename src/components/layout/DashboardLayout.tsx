import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface DashboardLayoutProps {
  activeTab: string;
  activeTabLabel: string;
  onTabChange: (id: string) => void;
  sidebarItems: SidebarItem[];
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
  onLogout: () => void;
  socketConnected: boolean;
  onRefresh: () => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  activeTabLabel,
  onTabChange,
  sidebarItems,
  adminName,
  adminEmail,
  adminRole,
  onLogout,
  socketConnected,
  onRefresh,
  searchValue,
  onSearchChange,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primaryBg text-text font-sans antialiased">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-primaryBg/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        items={sidebarItems}
        adminName={adminName}
        adminRole={adminRole}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          socketConnected={socketConnected}
          onRefresh={onRefresh}
          onLogout={onLogout}
          onOpenSidebar={() => setSidebarOpen(true)}
          adminName={adminName}
          adminEmail={adminEmail}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
