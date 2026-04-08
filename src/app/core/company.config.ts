export interface BusinessHours {
  label: string;
  time: string;
}

export interface CompanyAddress {
  city: string;
  country: string;
  zone: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: CompanyAddress;
  hours: BusinessHours[];
  founded: number;
}

export const COMPANY: CompanyConfig = {
  name: 'GENX AUTOMATION',
  tagline:
    "Automatisation industrielle sur mesure. Un seul interlocuteur, de l'étude à la mise en service.",
  email: 'contact@genx-automation.ma',
  phone: '+212 662-886949',
  address: {
    city: 'Casablanca',
    country: 'Maroc',
    zone: 'Zone Industrielle, Tit Mellil',
  },
  hours: [
    { label: 'Lun - Ven', time: '08:30 - 18:00' },
    { label: 'Samedi', time: '09:00 - 12:30' },
  ],
  founded: 2024,
};
