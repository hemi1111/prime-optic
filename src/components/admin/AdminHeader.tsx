import { useTranslation } from "../../hooks/useTranslation";
import Button from "../ui/Button";

type AdminHeaderProps = {
  onToggleAddForm: () => void;
  showAddForm: boolean;
  onPopulateSample: () => void;
  onMakeAdmin?: () => void;
  isLoading: boolean;
  canMakeAdmin: boolean;
};

const AdminHeader = ({
  onToggleAddForm,
  showAddForm,
  onPopulateSample,
  onMakeAdmin,
  isLoading,
  canMakeAdmin,
}: AdminHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t("admin.title")}
        </h1>
        <p className="text-sm text-slate-500">{t("admin.description")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        {canMakeAdmin && onMakeAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={onMakeAdmin}
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-400"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Make Admin
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={onPopulateSample}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Add Sample Data
        </Button>
        <Button
          variant={showAddForm ? "secondary" : "primary"}
          size="sm"
          onClick={onToggleAddForm}
        >
          {showAddForm ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;