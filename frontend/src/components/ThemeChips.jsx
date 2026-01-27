/**
 * ThemeChips Component
 * 
 * Displays a list of themes as rounded pill/chip elements.
 */
const ThemeChips = ({ themes }) => {
  if (!themes || themes.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Common Themes</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, index) => (
          <span
            key={index}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ThemeChips;
