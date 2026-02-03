import { Link } from "react-router-dom";

import { useTranslation } from "../hooks/useTranslation";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary-600">
        404
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {t("notFound.title")}
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        {t("notFound.description")}
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          {t("notFound.goHome")}
        </Link>
        <Link
          to="/glasses"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
        >
          {t("notFound.browseGlasses")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
