export default function ChipToggle({ options, selected, onToggle, activeClass, inactiveClass }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ emoji, label }) => {
        const active = selected.includes(label);
        return (
          <button key={label} type="button" onClick={() => onToggle(label)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${active ? activeClass : inactiveClass}`}>
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
