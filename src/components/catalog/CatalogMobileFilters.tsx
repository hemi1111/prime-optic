import { useTranslation } from "../../hooks/useTranslation";

type CatalogMobileFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onToggleFilter: (id: string) => void;
  filterOptions: readonly { id: string; labelKey: string }[];
};

const CatalogMobileFilters = ({
  isOpen,
  onClose,
  selectedFilters,
  onToggleFilter,
  filterOptions,
}: CatalogMobileFiltersProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getTranslationKey = (labelKey: string): string => {
    // Map gender filters to common keys
    if (labelKey === "men" || labelKey === "women" || labelKey === "kids") {
      return `common.${labelKey}`;
    }
    // Map shape filters to productDetail.shapes keys
    if (labelKey === "round" || labelKey === "square" || labelKey === "catEye") {
      return `productDetail.shapes.${labelKey}`;
    }
    // Map material filters to productDetail.materials keys
    if (labelKey === "metal" || labelKey === "plastic") {
      return `productDetail.materials.${labelKey}`;
    }
    // Fallback to catalog.filters for any other keys
    return `catalog.filters.${labelKey}`;
  };

  const optionsWithLabels = filterOptions.map((f) => ({
    id: f.id,
    label: t(getTranslationKey(f.labelKey)),
  }));

  return (
    <div className="lg:hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {t("catalog.filters")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {optionsWithLabels.map((filter) => (
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
  );
};

export default CatalogMobileFilters;
