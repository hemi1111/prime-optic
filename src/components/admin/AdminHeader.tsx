import { useTranslation } from "../../hooks/useTranslation";

import { Button } from "../ui/Button";

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
    <header className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t("admin.title")}
        </h1>
        <p className="text-sm text-slate-500">{t("admin.description")}</p>
      </div>
      <div className="flex gap-2">
        {canMakeAdmin && onMakeAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={onMakeAdmin}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Make Admin
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={onPopulateSample}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Sample Data
        </Button>
        <Button
          variant={showAddForm ? "secondary" : "primary"}
          size="sm"
          onClick={onToggleAddForm}
        >
          {showAddForm ? "Cancel" : "Add Product"}
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;