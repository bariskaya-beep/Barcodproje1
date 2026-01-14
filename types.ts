
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  role: string; // GUEST or CREW
  barcodeValue: string;
  nationality: string;
  passportNo: string;
  cabinNo: string;
  arrivalDate: string;
  departureDate: string;
  flag: string;
  vesselName: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW'
}
