type StepPillProps = {
  active: boolean;
  completed?: boolean;
  label: string;
};

const StepPill = ({ active, completed, label }: StepPillProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
          completed
            ? "bg-green-500 text-white"
            : active
              ? "bg-primary-500 text-white"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {completed ? "✓" : active ? "•" : ""}
      </div>
      <span className={active ? "text-slate-900" : "text-slate-500"}>
        {label}
      </span>
    </div>
  );
};

import { useTranslation } from "../../hooks/useTranslation";

type CheckoutStepperProps = {
  currentStep: number;
};

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
      <StepPill
        active={currentStep >= 1}
        completed={currentStep > 1}
        label={t("checkout.contactDetails")}
      />
      <div className="h-px flex-1 bg-slate-200" />
      <StepPill
        active={currentStep >= 2}
        completed={currentStep > 2}
        label={t("common.delivery")}
      />
      <div className="h-px flex-1 bg-slate-200" />
      <StepPill active={currentStep >= 3} label={t("checkout.confirmOrder")} />
    </div>
  );
};

export default CheckoutStepper;
