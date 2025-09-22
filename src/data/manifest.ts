// src/data/manifest.ts

export type ManifestRow = {
  sno: number;
  manifest: string;
  destination: string;
  command: string;
  origin: string;
  airline: string;
  dateReg: Date;
  dateArrival: Date;
};

export const manifestData: ManifestRow[] = [
  {
    sno: 1,
    manifest: "AWB12345",
    destination: "Lagos",
    command: "Import",
    origin: "London",
    airline: "British Airways",
    dateReg: new Date("2024-09-01"),
    dateArrival: new Date("2024-09-05"),
  },
  {
    sno: 2,
    manifest: "BOL67890",
    destination: "New York",
    command: "Export",
    origin: "Lagos",
    airline: "Maersk Line",
    dateReg: new Date("2024-09-02"),
    dateArrival: new Date("2024-09-06"),
  },
];