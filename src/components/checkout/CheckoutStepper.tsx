import { useTranslation } from "../../hooks/useTranslation";

type StepPillProps = {
  stepNumber: number;
  active: boolean;
  completed?: boolean;
  label: string;
};

const StepPill = ({ stepNumber, active, completed, label }: StepPillProps) => {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
          completed
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-primary-500 text-white ring-2 ring-primary-200"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {completed ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          stepNumber
        )}
      </div>
      <span
        className={`hidden sm:inline text-sm font-medium ${
          active ? "text-slate-900" : completed ? "text-slate-700" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

type CheckoutStepperProps = {
  currentStep: number;
};

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 w-full">
      <StepPill
        stepNumber={1}
        active={currentStep === 1}
        completed={currentStep > 1}
        label={t("checkout.contactDetails")}
      />
      <div
        className={`h-0.5 flex-1 min-w-[12px] rounded-full transition-colors ${
          currentStep > 1 ? "bg-emerald-200" : "bg-slate-200"
        }`}
      />
      <StepPill
        stepNumber={2}
        active={currentStep === 2}
        completed={currentStep > 2}
        label={t("common.delivery")}
      />
      <div
        className={`h-0.5 flex-1 min-w-[12px] rounded-full transition-colors ${
          currentStep > 2 ? "bg-emerald-200" : "bg-slate-200"
        }`}
      />
      <StepPill
        stepNumber={3}
        active={currentStep === 3}
        completed={false}
        label={t("checkout.confirmOrder")}
      />
    </div>
  );
};

export default CheckoutStepper;
