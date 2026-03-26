export default function FormField({ label, children }) {
  return (
    <div>
      <label className="text-sm text-slate-600 font-medium block mb-1">{label}</label>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors ${className}`}
    />
  );
}

export function SelectInput({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white transition-colors ${className}`}
    >
      {options.map((opt) => {
        const label = typeof opt === 'object' ? opt.label : opt;
        const val = typeof opt === 'object' ? opt.value : opt;
        return <option key={val} value={val}>{label}</option>;
      })}
    </select>
  );
}
