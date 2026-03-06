import { useTranslation } from "../../hooks/useTranslation";
import type { AvailableFilterOptions } from "../../hooks/useCatalogState";

const GENDER_KEYS: Record<string, string> = {
  men: "common.men",
  women: "common.women",
  kids: "common.kids",
  unisex: "common.unisex",
};
const SHAPE_KEYS: Record<string, string> = {
  round: "productDetail.shapes.round",
  square: "productDetail.shapes.square",
  "cat-eye": "productDetail.shapes.catEye",
  oval: "productDetail.shapes.oval",
  aviator: "productDetail.shapes.aviator",
  rectangular: "productDetail.shapes.rectangular",
  oversized: "productDetail.shapes.oversized",
  pilot: "productDetail.shapes.pilot",
  "rounded square": "productDetail.shapes.roundedSquare",
  wrapped: "productDetail.shapes.wrapped",
  sport: "productDetail.shapes.sport",
  browline: "productDetail.shapes.browline",
};
const MATERIAL_KEYS: Record<string, string> = {
  metal: "productDetail.materials.metal",
  plastic: "productDetail.materials.plastic",
  acetate: "productDetail.materials.acetate",
  titanium: "productDetail.materials.titanium",
  mixed: "productDetail.materials.mixed",
  nylon: "productDetail.materials.nylon",
  "carbon fiber": "productDetail.materials.carbonFiber",
  TR90: "productDetail.materials.TR90",
  "recycled acetate": "productDetail.materials.recycledAcetate",
  "acetate/metal": "productDetail.materials.acetateMetal",
};

type CatalogFiltersSidebarProps = {
  selectedFilters: string[];
  onClearFilters: () => void;
  onToggleFilter: (id: string) => void;
  availableFilterOptions: AvailableFilterOptions;
};

const CatalogFiltersSidebar = ({
  selectedFilters,
  onClearFilters,
  onToggleFilter,
  availableFilterOptions,
}: CatalogFiltersSidebarProps) => {
  const { t } = useTranslation();

  const genderOptions = availableFilterOptions.genderIds.map((id) => ({
    id,
    label: t(GENDER_KEYS[id] ?? id),
  }));
  const shapeOptions = availableFilterOptions.shapeIds.map((id) => ({
    id,
    label: t(SHAPE_KEYS[id] ?? id),
  }));
  const materialOptions = availableFilterOptions.materialIds.map((id) => ({
    id,
    label: t(MATERIAL_KEYS[id] ?? id),
  }));

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
          {genderOptions.length > 0 && (
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
          )}

          {shapeOptions.length > 0 && (
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
          )}

          {materialOptions.length > 0 && (
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
          )}
        </div>
      </div>
    </aside>
  );
};

export default CatalogFiltersSidebar;
