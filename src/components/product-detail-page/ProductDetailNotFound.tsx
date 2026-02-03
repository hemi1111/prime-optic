import { useTranslation } from "../../hooks/useTranslation";

export function ProductDetailNotFound() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t("catalog.productNotFound")}
        </h1>
        <p className="text-gray-600">{t("catalog.productNotFoundDesc")}</p>
      </div>
    </div>
  );
}
