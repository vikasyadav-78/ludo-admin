import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  width = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primaryBg/80 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <motion.div
              initial={{ translateX: '100%' }}
              animate={{ translateX: 0 }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={twMerge(
                'w-screen bg-cardBg border-l border-border flex flex-col h-full',
                width,
                className
              )}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                {title ? (
                  <h3 className="text-base font-bold text-text uppercase tracking-wider">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  onClick={onClose}
                  className="text-secondaryText hover:text-text hover:bg-secondaryBg/80 p-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default Drawer;
