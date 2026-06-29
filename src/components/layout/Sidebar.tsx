import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { twMerge } from 'tailwind-merge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  items: SidebarItem[];
  adminName?: string;
  adminRole?: string;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  items,
  adminName = 'Administrator',
  adminRole = 'Root Admin',
  onLogout,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={twMerge(
        'w-[280px] bg-cardBg border-r border-border flex flex-col h-full shrink-0 transition-transform duration-300 z-40 lg:translate-x-0 lg:static fixed top-0 bottom-0 left-0 glassmorphism',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-black text-accent tracking-wider uppercase select-none">Ludo Control</h2>
          <span className="text-[10px] text-secondaryText uppercase tracking-widest select-none">Platform Dashboard</span>
        </div>
      </div>

      {/* Scrollable Navigation Menu */}
      <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-1.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose(); // Auto close on mobile
              }}
              className={twMerge(
                'relative flex items-center gap-3.5 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all select-none border-none bg-transparent cursor-pointer',
                isActive ? 'text-accent font-bold' : 'text-secondaryText hover:text-text hover:bg-secondaryBg/40'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-accent/5 rounded-lg border border-accent/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              
              <Icon size={18} className={twMerge('shrink-0 relative z-10', isActive ? 'text-accent' : 'text-secondaryText')} />
              <span className="flex-1 text-left relative z-10">{item.label}</span>
              
              {item.badge && item.badge > 0 ? (
                <span className="relative z-10 bg-danger text-text text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Admin Profile Section fixed at bottom */}
      <div className="p-4 border-t border-border flex items-center justify-between shrink-0 bg-cardBg/90">
        <div className="flex items-center gap-3">
          <Avatar name={adminName} size="sm" />
          <div className="flex flex-col select-none">
            <span className="text-xs font-bold text-text truncate max-w-[140px]">{adminName}</span>
            <span className="text-[10px] text-secondaryText">{adminRole}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-secondaryText hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-all cursor-pointer border-none bg-transparent"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
