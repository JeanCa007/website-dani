import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, id, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
      />
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextAreaField({ label, id, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground-700 mb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        className="w-full px-4 py-2.5 text-sm bg-background-50 border border-background-200 rounded-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors resize-y min-h-[100px]"
      />
    </div>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-100 rounded-lg border border-background-200 p-6 space-y-4">
      {children}
    </div>
  );
}