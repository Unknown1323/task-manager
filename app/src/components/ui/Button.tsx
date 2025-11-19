import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
    return (
        <button
            className={`px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
            style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased'
            }}
            {...props}
        >
            {children}
        </button>
    );
}
