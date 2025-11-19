import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    darkMode?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', type, value, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium mb-2">{label}</label>}
                <input
                    ref={ref}
                    type={type}
                    value={value ?? ''}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        error ? 'ring-2 ring-red-500' : ''
                    } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
