import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    darkMode?: boolean;
}

export function Card({ children, className = '', darkMode = true, ...props }: CardProps) {
    return (
        <div
            className={`${
                darkMode
                    ? 'bg-slate-800 hover:bg-slate-750 border-slate-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
            } rounded-xl p-4 shadow-sm transition border ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
