interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  numberCheckedIn: number;
  isCheckedIn: boolean;
  timeCheckedIn: string;
}

interface CustomerExport {
  name: string;
  email: string;
  phone: string;
  position: string;
  qrCode: any;
}

interface CustomerRequest {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  position: string;
}
export type { Customer, CustomerExport, CustomerRequest };
