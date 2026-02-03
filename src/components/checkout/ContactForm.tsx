import Field from "../ui/Field";

import { useTranslation } from "../../hooks/useTranslation";

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type ContactFormProps = {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  onNext: () => void;
};

const ContactForm = ({
  customerInfo,
  setCustomerInfo,
  onNext,
}: ContactFormProps) => {
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.fullName && customerInfo.email && customerInfo.phone) {
      onNext();
    }
  };

  return (
    <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
      <h3 className="font-semibold text-slate-900">
        {t("common.contactInformation")}
      </h3>
      <Field
        label={t("common.fullName")}
        id="name"
        value={customerInfo.fullName}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, fullName: e.target.value })
        }
        placeholder="Your full name"
        required
      />
      <Field
        label={t("auth.email")}
        id="email"
        type="email"
        value={customerInfo.email}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, email: e.target.value })
        }
        placeholder="your@email.com"
        required
      />
      <Field
        label={t("common.phoneNumber")}
        id="phone"
        type="tel"
        value={customerInfo.phone}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, phone: e.target.value })
        }
        placeholder="+355 69 123 4567"
        required
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
      >
        {t("common.continueToDelivery")}
      </button>
    </form>
  );
};

export default ContactForm;
