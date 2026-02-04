export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isAvailable: boolean;
};

export const storeLocations: StoreLocation[] = [
  {
    id: "1",
    name: "Prime Optic - City Center",
    address: "Rruga Dëshmorët e Kombit, Tirana 1001, Albania",
    phone: "+355 4 123 4567",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Prime Optic - Blloku",
    address: "Rruga Ismail Qemali, Blloku, Tirana 1001, Albania",
    phone: "+355 4 234 5678",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Prime Optic - TEG",
    address: "Tirana East Gate, Rruga e Elbasanit, Tirana 1001, Albania",
    phone: "+355 4 345 6789",
    hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Prime Optic - Qendra Tregtare",
    address: "Qendra Tregtare Univers, Rruga Kavajës, Tirana 1001, Albania",
    phone: "+355 4 456 7890",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Prime Optic - Airport Road",
    address: "Rruga e Aeroportit, Lapraka, Tirana 1001, Albania",
    phone: "+355 4 567 8901",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
    isAvailable: false,
  },
];
