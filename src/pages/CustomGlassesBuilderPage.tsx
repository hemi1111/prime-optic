import { useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";
import { useCurrency } from "../hooks/useCurrency";
import { useToast } from "../hooks/useToast";
import { useCartStore } from "../store/useCartStore";
import { LENS_TYPES, type LensType } from "../config/lensTypes";
import type { Product, CartItem } from "../types/product";

type PrescriptionEye = {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
};

const formatEyePrescription = (
  eyeLabel: string,
  eye: PrescriptionEye
): string | null => {
  const parts: string[] = [];

  if (eye.sph.trim()) parts.push(`SPH ${eye.sph.trim()}`);
  if (eye.cyl.trim()) parts.push(`CYL ${eye.cyl.trim()}`);
  if (eye.axis.trim()) parts.push(`AXIS ${eye.axis.trim()}`);
  if (eye.add.trim()) parts.push(`ADD ${eye.add.trim()}`);

  if (parts.length === 0) {
    return null;
  }

  return `${eyeLabel}: ${parts.join(", ")}`;
};

const formatPrescriptionVariant = (
  rightEye: PrescriptionEye,
  leftEye: PrescriptionEye
): string | undefined => {
  const right = formatEyePrescription("OD", rightEye);
  const left = formatEyePrescription("OS", leftEye);
  const sections = [right, left].filter(Boolean) as string[];

  return sections.length > 0 ? sections.join(" | ") : undefined;
};

const CustomGlassesBuilderPage = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const { products, isLoading } = useProducts("glasses");
  const addItem = useCartStore((state) => state.addItem);

  const [selectedFrame, setSelectedFrame] = useState<Product | null>(null);
  const [selectedLensType, setSelectedLensType] = useState<LensType>(
    LENS_TYPES[0]
  );
  const [rightEye, setRightEye] = useState<PrescriptionEye>({
    sph: "",
    cyl: "",
    axis: "",
    add: "",
  });
  const [leftEye, setLeftEye] = useState<PrescriptionEye>({
    sph: "",
    cyl: "",
    axis: "",
    add: "",
  });
  const [addBlueLightFilter, setAddBlueLightFilter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blueLightFilterPrice = 25;

  const calculateTotalPrice = (): number => {
    if (!selectedFrame) return 0;
    let total = selectedFrame.price;
    total += selectedLensType.priceAdjustment;
    if (addBlueLightFilter) {
      total += blueLightFilterPrice;
    }
    return total;
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFrame) {
      toast.error(t("customGlasses.errors.selectFrame"));
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculateTotalPrice();
      const prescriptionVariant = formatPrescriptionVariant(rightEye, leftEye);

      // Create a custom name that includes lens type
      const customName = `${selectedFrame.name} - ${selectedLensType.name}${
        addBlueLightFilter ? " + Blue Light Filter" : ""
      }`;

      const cartItem: Omit<CartItem, "quantity"> = {
        ...selectedFrame,
        name: customName,
        price: totalPrice,
        addBlueLightFilter,
        variant: prescriptionVariant,
      };

      addItem(cartItem, 1);
      toast.success(t("toast.addToCart.success"));
      
      // Reset form
      setSelectedFrame(null);
      setSelectedLensType(LENS_TYPES[0]);
      setRightEye({ sph: "", cyl: "", axis: "", add: "" });
      setLeftEye({ sph: "", cyl: "", axis: "", add: "" });
      setAddBlueLightFilter(false);
    } catch (error) {
      console.error(error);
      toast.error(t("toast.error.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header className="space-y-4 text-center">
        <div className="inline-block rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          {t("customGlasses.badge")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
          {t("customGlasses.title")}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          {t("customGlasses.description")}
        </p>
      </header>

      <form
        onSubmit={handleAddToCart}
        className="space-y-8 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200/50"
      >
        {/* Frame Selection */}
        <div className="space-y-4">
          <label
            htmlFor="frame"
            className="block text-sm font-semibold text-slate-900"
          >
            {t("customGlasses.frameSelection")} *
          </label>
          {isLoading ? (
            <div className="text-sm text-slate-500">
              {t("common.loading")}
            </div>
          ) : (
            <select
              id="frame"
              value={selectedFrame?.id || ""}
              onChange={(e) => {
                const frame = products.find((p) => p.id === e.target.value);
                setSelectedFrame(frame || null);
              }}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            >
              <option value="">
                {t("customGlasses.selectFrame")}
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.brand} - {product.name} ({formatPrice(product.price)})
                </option>
              ))}
            </select>
          )}
          {selectedFrame && (
            <div className="mt-4 flex gap-4 rounded-lg border border-slate-200 p-4">
              {selectedFrame.imageUrl && (
                <img
                  src={selectedFrame.imageUrl}
                  alt={selectedFrame.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {selectedFrame.brand} - {selectedFrame.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {formatPrice(selectedFrame.price)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lens Type Selection */}
        <div className="space-y-4">
          <label
            htmlFor="lensType"
            className="block text-sm font-semibold text-slate-900"
          >
            {t("customGlasses.lensType")} *
          </label>
          <select
            id="lensType"
            value={selectedLensType.id}
            onChange={(e) => {
              const lensType = LENS_TYPES.find((lt) => lt.id === e.target.value);
              if (lensType) setSelectedLensType(lensType);
            }}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
          >
            {LENS_TYPES.map((lensType) => (
              <option key={lensType.id} value={lensType.id}>
                {lensType.name}
                {lensType.priceAdjustment > 0
                  ? ` (+${formatPrice(lensType.priceAdjustment)})`
                  : ""}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-600">
            {selectedLensType.description}
          </p>
        </div>

        {/* Prescription */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {t("customGlasses.prescription")}
          </h3>

          {/* Right Eye */}
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900">
              {t("customGlasses.rightEye")}
            </h4>
            <div className="grid gap-4 md:grid-cols-4">
              <Field
                id="rightSph"
                label={t("customGlasses.sph")}
                type="number"
                step="0.25"
                value={rightEye.sph}
                onChange={(e) =>
                  setRightEye({ ...rightEye, sph: e.target.value })
                }
                placeholder="-2.50"
              />
              <Field
                id="rightCyl"
                label={t("customGlasses.cyl")}
                type="number"
                step="0.25"
                value={rightEye.cyl}
                onChange={(e) =>
                  setRightEye({ ...rightEye, cyl: e.target.value })
                }
                placeholder="-0.75"
              />
              <Field
                id="rightAxis"
                label={t("customGlasses.axis")}
                type="number"
                step="1"
                min="0"
                max="180"
                value={rightEye.axis}
                onChange={(e) =>
                  setRightEye({ ...rightEye, axis: e.target.value })
                }
                placeholder="90"
              />
              <Field
                id="rightAdd"
                label={t("customGlasses.add")}
                type="number"
                step="0.25"
                value={rightEye.add}
                onChange={(e) =>
                  setRightEye({ ...rightEye, add: e.target.value })
                }
                placeholder="+2.00"
              />
            </div>
          </div>

          {/* Left Eye */}
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900">
              {t("customGlasses.leftEye")}
            </h4>
            <div className="grid gap-4 md:grid-cols-4">
              <Field
                id="leftSph"
                label={t("customGlasses.sph")}
                type="number"
                step="0.25"
                value={leftEye.sph}
                onChange={(e) =>
                  setLeftEye({ ...leftEye, sph: e.target.value })
                }
                placeholder="-2.50"
              />
              <Field
                id="leftCyl"
                label={t("customGlasses.cyl")}
                type="number"
                step="0.25"
                value={leftEye.cyl}
                onChange={(e) =>
                  setLeftEye({ ...leftEye, cyl: e.target.value })
                }
                placeholder="-0.75"
              />
              <Field
                id="leftAxis"
                label={t("customGlasses.axis")}
                type="number"
                step="1"
                min="0"
                max="180"
                value={leftEye.axis}
                onChange={(e) =>
                  setLeftEye({ ...leftEye, axis: e.target.value })
                }
                placeholder="90"
              />
              <Field
                id="leftAdd"
                label={t("customGlasses.add")}
                type="number"
                step="0.25"
                value={leftEye.add}
                onChange={(e) =>
                  setLeftEye({ ...leftEye, add: e.target.value })
                }
                placeholder="+2.00"
              />
            </div>
          </div>
        </div>

        {/* Blue Light Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={addBlueLightFilter}
              onChange={(e) => setAddBlueLightFilter(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-900">
                {t("common.addBlueLightFilter")}
              </span>
              <span className="ml-2 text-sm text-slate-600">
                ({formatPrice(blueLightFilterPrice)})
              </span>
            </div>
          </label>
          <p className="text-sm text-slate-600 ml-7">
            {t("common.blueLightDescription")}
          </p>
        </div>

        {/* Price Summary */}
        {selectedFrame && (
          <div className="rounded-lg bg-slate-50 p-6 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{t("customGlasses.framePrice")}:</span>
              <span>{formatPrice(selectedFrame.price)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>{selectedLensType.name}:</span>
              <span>
                {selectedLensType.priceAdjustment > 0
                  ? `+${formatPrice(selectedLensType.priceAdjustment)}`
                  : t("common.free")}
              </span>
            </div>
            {addBlueLightFilter && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t("common.blueLightFilter")}:</span>
                <span>+{formatPrice(blueLightFilterPrice)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>{t("customGlasses.totalPrice")}:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedFrame}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 bg-size-200 bg-pos-0 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-500 hover:scale-105 hover:bg-pos-100 hover:shadow-2xl hover:shadow-primary-500/30 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
          style={{
            backgroundSize: "200% 100%",
            backgroundPosition: "0% 0%",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting && selectedFrame) {
              e.currentTarget.style.backgroundPosition = "100% 0%";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting && selectedFrame) {
              e.currentTarget.style.backgroundPosition = "0% 0%";
            }
          }}
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t("common.loading")}
            </>
          ) : (
            <>
              {t("customGlasses.addToCart")} - {formatPrice(totalPrice)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Field = ({
  id,
  label,
  type = "text",
  step,
  min,
  max,
  value,
  onChange,
  placeholder,
}: FieldProps) => {
  return (
    <div className="space-y-1 text-sm">
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
      />
    </div>
  );
};

export default CustomGlassesBuilderPage;
