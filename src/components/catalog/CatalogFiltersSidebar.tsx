import { useTranslation } from "../../hooks/useTranslation";

type CatalogFiltersSidebarProps = {
  selectedFilters: string[];
  onClearFilters: () => void;
  onToggleFilter: (id: string) => void;
};

const CatalogFiltersSidebar = ({
  selectedFilters,
  onClearFilters,
  onToggleFilter,
}: CatalogFiltersSidebarProps) => {
  const { t } = useTranslation();

  const genderOptions = [
    { id: "men", label: t("common.men") },
    { id: "women", label: t("common.women") },
    { id: "kids", label: t("common.kids") },
  ];
  const shapeOptions = [
    { id: "round", label: t("productDetail.shapes.round") },
    { id: "square", label: t("productDetail.shapes.square") },
    { id: "cat-eye", label: t("productDetail.shapes.catEye") },
    { id: "oval", label: t("productDetail.shapes.oval") },
    { id: "aviator", label: t("productDetail.shapes.aviator") },
    { id: "rectangular", label: t("productDetail.shapes.rectangular") },
    { id: "oversized", label: t("productDetail.shapes.oversized") },
    { id: "pilot", label: t("productDetail.shapes.pilot") },
    { id: "rounded square", label: t("productDetail.shapes.roundedSquare") },
    { id: "wrapped", label: t("productDetail.shapes.wrapped") },
    { id: "sport", label: t("productDetail.shapes.sport") },
    { id: "browline", label: t("productDetail.shapes.browline") },
  ];
  const materialOptions = [
    { id: "metal", label: t("productDetail.materials.metal") },
    { id: "plastic", label: t("productDetail.materials.plastic") },
    { id: "acetate", label: t("productDetail.materials.acetate") },
    { id: "titanium", label: t("productDetail.materials.titanium") },
    { id: "mixed", label: t("productDetail.materials.mixed") },
    { id: "nylon", label: t("productDetail.materials.nylon") },
    { id: "carbon fiber", label: t("productDetail.materials.carbonFiber") },
    { id: "TR90", label: t("productDetail.materials.TR90") },
    { id: "recycled acetate", label: t("productDetail.materials.recycledAcetate") },
    { id: "acetate/metal", label: t("productDetail.materials.acetateMetal") },
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
};

export default CatalogFiltersSidebar;
