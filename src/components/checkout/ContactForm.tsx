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
    <form className="space-y-5 text-sm" onSubmit={handleSubmit}>
      <h3 className="text-base font-bold text-slate-900">
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
        className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft hover:from-primary-600 hover:to-primary-700 transition"
      >
        {t("common.continueToDelivery")}
      </button>
    </form>
  );
};

export default ContactForm;
