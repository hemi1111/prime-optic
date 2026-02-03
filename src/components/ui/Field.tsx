type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  checked?: boolean;
  className?: string;
};

const Field = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  options,
  rows,
  checked,
  className = "",
}: FieldProps) => {
  const baseInputClasses =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2";

  if (type === "textarea") {
    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows || 3}
          className={baseInputClasses}
        />
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={baseInputClasses}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="rounded border-slate-300 text-primary-600 focus:ring-primary-200"
        />
        <label htmlFor={id} className="text-sm text-slate-700">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={baseInputClasses}
      />
    </div>
  );
};

export default Field;
