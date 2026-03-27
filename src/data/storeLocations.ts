export type StoreLocationI18nFields = {
  name?: string;
  address?: string;
  hours?: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isAvailable: boolean;
  /** Optional overrides per locale; missing fields fall back to the base `name` / `address` / `hours`. */
  i18n?: Partial<Record<"en" | "sq" | "it", StoreLocationI18nFields>>;
};

/** Seed data for populating the stores Firestore collection (admin). */
export const storeLocationsSeed: Omit<StoreLocation, "id">[] = [
  {
    name: "Prime Optic - City Center",
    address: "Rruga Dëshmorët e Kombit, Tirana 1001, Albania",
    phone: "+355 4 123 4567",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    isAvailable: true,
    i18n: {
      sq: {
        name: "Prime Optic - Qendra e qytetit",
        hours: "Hënë–Sht: 9:00–20:00, Die: 10:00–18:00",
      },
      it: {
        name: "Prime Optic - Centro città",
        hours: "Lun–Sab: 9:00–20:00, Dom: 10:00–18:00",
      },
    },
  },
  {
    name: "Prime Optic - Blloku",
    address: "Rruga Ismail Qemali, Blloku, Tirana 1001, Albania",
    phone: "+355 4 234 5678",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    isAvailable: true,
    i18n: {
      sq: {
        name: "Prime Optic - Blloku",
        hours: "Hënë–Sht: 9:00–20:00, Die: 10:00–18:00",
      },
      it: {
        name: "Prime Optic - Blloku",
        hours: "Lun–Sab: 9:00–20:00, Dom: 10:00–18:00",
      },
    },
  },
  {
    name: "Prime Optic - TEG",
    address: "Tirana East Gate, Rruga e Elbasanit, Tirana 1001, Albania",
    phone: "+355 4 345 6789",
    hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM",
    isAvailable: true,
    i18n: {
      sq: {
        name: "Prime Optic - TEG",
        hours: "Hënë–Sht: 10:00–21:00, Die: 11:00–19:00",
      },
      it: {
        name: "Prime Optic - TEG",
        hours: "Lun–Sab: 10:00–21:00, Dom: 11:00–19:00",
      },
    },
  },
  {
    name: "Prime Optic - Qendra Tregtare",
    address: "Qendra Tregtare Univers, Rruga Kavajës, Tirana 1001, Albania",
    phone: "+355 4 456 7890",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed",
    isAvailable: true,
    i18n: {
      sq: {
        name: "Prime Optic - Qendra tregtare",
        hours: "Hënë–Sht: 9:00–20:00, Die: mbyllur",
      },
      it: {
        name: "Prime Optic - Centro commerciale",
        hours: "Lun–Sab: 9:00–20:00, Dom: chiuso",
      },
    },
  },
  {
    name: "Prime Optic - Airport Road",
    address: "Rruga e Aeroportit, Lapraka, Tirana 1001, Albania",
    phone: "+355 4 567 8901",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
    isAvailable: false,
    i18n: {
      sq: {
        name: "Prime Optic - Rruga e aeroportit",
        hours: "Hënë–Sht: 9:00–19:00, Die: 10:00–17:00",
      },
      it: {
        name: "Prime Optic - Strada per l’aeroporto",
        hours: "Lun–Sab: 9:00–19:00, Dom: 10:00–17:00",
      },
    },
  },
];
