import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
    darkMode?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className = '', children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium mb-2">{label}</label>}
                <select
                    ref={ref}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        error ? 'ring-2 ring-red-500' : ''
                    } ${className}`}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
