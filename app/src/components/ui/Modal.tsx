'use client';

import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const isDark = mounted && resolvedTheme === 'dark';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl shadow-black/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                style={{
                    background: isDark
                        ? 'linear-gradient(to bottom right, rgb(30 41 59), rgb(15 23 42))'
                        : 'white',
                    borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgb(229 231 235)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header з градієнтом */}
                <div
                    className="sticky top-0 z-10 backdrop-blur-xl px-6 py-5 flex items-center justify-between"
                    style={{
                        background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgb(229 231 235)'}`,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                        <h2
                            className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                            style={{
                                backgroundImage: isDark
                                    ? 'linear-gradient(to right, rgb(129 140 248), rgb(192 132 252))'
                                    : 'linear-gradient(to right, rgb(79 70 229), rgb(147 51 234))',
                            }}
                        >
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl transition-all duration-200 hover:rotate-90"
                        style={{
                            color: isDark ? 'rgb(156 163 175)' : 'rgb(75 85 99)',
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark
                                ? 'rgb(51 65 85)'
                                : 'rgb(243 244 246)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="Закрити"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content з кращим скролом */}
                <div
                    className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 custom-scrollbar"
                    style={{
                        color: isDark ? 'white' : 'rgb(17 24 39)',
                    }}
                >
                    {children}
                </div>

                {/* Footer з градієнтом */}
                {footer && (
                    <div
                        className="sticky bottom-0 z-10 backdrop-blur-xl px-6 py-5"
                        style={{
                            background: isDark
                                ? 'rgba(30, 41, 59, 0.95)'
                                : 'rgba(255, 255, 255, 0.95)',
                            borderTop: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgb(229 231 235)'}`,
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
