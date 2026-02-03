import { useTranslation } from "../../hooks/useTranslation";

type CatalogFiltersSidebarProps = {
  selectedFilters: string[];
  onClearFilters: () => void;
  onToggleFilter: (id: string) => void;
};

export function CatalogFiltersSidebar({
  selectedFilters,
  onClearFilters,
  onToggleFilter,
}: CatalogFiltersSidebarProps) {
  const { t } = useTranslation();

  const genderOptions = [
    { id: "men", label: t("catalog.filters.men") },
    { id: "women", label: t("catalog.filters.women") },
    { id: "kids", label: t("catalog.filters.kids") },
  ];
  const shapeOptions = [
    { id: "round", label: t("catalog.filters.round") },
    { id: "square", label: t("catalog.filters.square") },
    { id: "cat-eye", label: t("catalog.filters.catEye") },
  ];
  const materialOptions = [
    { id: "metal", label: t("catalog.filters.metal") },
    { id: "plastic", label: t("catalog.filters.plastic") },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            {t("catalog.filters")}
          </h2>
          {selectedFilters.length > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              {t("catalog.filters.clearAll")}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("catalog.filters.gender")}
            </div>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onToggleFilter(filter.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedFilters.includes(filter.id)
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("catalog.filters.frameShape")}
            </div>
            <div className="flex flex-wrap gap-2">
              {shapeOptions.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onToggleFilter(filter.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedFilters.includes(filter.id)
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("catalog.filters.material")}
            </div>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onToggleFilter(filter.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedFilters.includes(filter.id)
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
