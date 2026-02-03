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

type CheckoutStepperProps = {
  currentStep: number;
};

export const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
      <StepPill
        active={currentStep >= 1}
        completed={currentStep > 1}
        label="Contact details"
      />
      <div className="h-px flex-1 bg-slate-200" />
      <StepPill
        active={currentStep >= 2}
        completed={currentStep > 2}
        label="Delivery"
      />
      <div className="h-px flex-1 bg-slate-200" />
      <StepPill active={currentStep >= 3} label="Confirm order" />
    </div>
  );
};

export default CheckoutStepper;
