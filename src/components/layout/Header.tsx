import React from 'react';
import { Menu, RefreshCw, Bell, Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';
import { twMerge } from 'tailwind-merge';

interface HeaderProps {
  socketConnected: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  onOpenSidebar: () => void;
  adminName?: string;
  adminEmail?: string;
  adminAvatar?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  notificationCount?: number;
  onTabChange: (tabId: string) => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  socketConnected,
  onRefresh,
  onLogout,
  onOpenSidebar,
  adminName = 'Administrator',
  adminEmail = 'admin@platform.com',
  adminAvatar,
  searchValue,
  onSearchChange,
  notificationCount = 0,
  onTabChange,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-cardBg/75 border-b border-border backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="text-secondaryText hover:text-text p-1.5 rounded-lg hover:bg-secondaryBg/80 lg:hidden transition-all cursor-pointer border-none bg-transparent"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Responsive Search Input */}
        <div className="relative w-28 xs:w-36 sm:w-48">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondaryText pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-2.5 py-1.5 bg-primaryBg/50 border border-border rounded-lg text-text placeholder-secondaryText outline-none text-[11px] transition-all duration-200 focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>

        <button
          onClick={onRefresh}
          className="text-secondaryText hover:text-text p-2 rounded-lg hover:bg-secondaryBg/80 transition-all cursor-pointer border-none bg-transparent"
          title="Refresh Data"
        >
          <RefreshCw size={15} />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative text-secondaryText hover:text-text p-2 rounded-lg hover:bg-secondaryBg/80 transition-all cursor-pointer border-none bg-transparent"
          title="Pending Actions"
        >
          <Bell size={15} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-danger w-2 h-2 rounded-full ring-2 ring-cardBg animate-pulse" />
          )}
        </button>

        {/* Hide status badge on extremely small screens to fit search */}
        <span
          className={twMerge(
            'hidden xs:flex px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border items-center gap-1.5 select-none transition-all duration-300',
            socketConnected
              ? 'bg-success/5 text-success border-success/20'
              : 'bg-danger/5 text-danger border-danger/20'
          )}
        >
          <span className={twMerge('w-1.5 h-1.5 rounded-full', socketConnected ? 'bg-success animate-pulse' : 'bg-danger')} />
          {socketConnected ? 'LIVE' : 'OFFLINE'}
        </span>

        <Dropdown
          trigger={
            <div className="flex items-center gap-2 group cursor-pointer">
              <Avatar name={adminName} src={adminAvatar} size="sm" className="ring-1 ring-border group-hover:ring-accent transition-all" />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-text group-hover:text-accent transition-all">{adminName}</span>
                <span className="text-[9px] text-secondaryText truncate max-w-[100px]">{adminEmail}</span>
              </div>
            </div>
          }
          items={[
            {
              label: 'View Profile',
              onClick: () => onTabChange('profile'),
              className: 'border-b border-border/50 pb-2'
            },
            {
              label: 'Sign Out',
              onClick: onLogout,
              className: 'text-danger hover:bg-danger/10 hover:text-text'
            }
          ]}
        />
      </div>
    </header>
  );
};
export default Header;
