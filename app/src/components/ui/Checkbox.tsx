import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    ref={ref}
                    type="checkbox"
                    className={`w-5 h-5 rounded cursor-pointer accent-indigo-600 ${className}`}
                    {...props}
                />
                {label && <span className="text-sm">{label}</span>}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';
