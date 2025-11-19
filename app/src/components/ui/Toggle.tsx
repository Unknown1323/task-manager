import { InputHTMLAttributes, forwardRef } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, checked, className = '', ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        checked={checked}
                        className="sr-only peer"
                        {...props}
                    />
                    <div className="w-11 h-6 bg-slate-600 dark:bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                {label && <span className="text-sm font-medium">{label}</span>}
            </label>
        );
    }
);

Toggle.displayName = 'Toggle';
