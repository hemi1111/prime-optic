import { useTranslation } from "../../hooks/useTranslation";
import { storeLocations } from "../../data/storeLocations";

type StoreLocationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const StoreLocationsModal = ({
  isOpen,
  onClose,
}: StoreLocationsModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("storeLocations.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={t("storeLocations.close")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <p className="mb-6 text-sm text-slate-600">
            {t("storeLocations.description")}
          </p>

          <div className="space-y-4">
            {storeLocations.map((store) => (
              <div
                key={store.id}
                className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {store.name}
                      </h3>
                      {store.isAvailable ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          {t("storeLocations.available")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          {t("storeLocations.unavailable")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{store.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{store.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{store.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 p-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            {t("storeLocations.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreLocationsModal;