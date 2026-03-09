'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2A4A]/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col border border-[#E8D5B0]/40`}>
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C9A96E] via-[#E8C4B8] to-[#8B9E7E] rounded-t-3xl" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2EDE4]">
          <h2 className="text-lg font-bold text-[#1B2A4A] tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8896B3] hover:text-[#1B2A4A] hover:bg-[#F2EDE4] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
