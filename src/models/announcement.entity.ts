export type AnnouncementEntity = {
  location: string;
  workType: string;
  accommodation: boolean;
  vehicle: boolean;
  remuneration: string;
  secretariat: boolean;
  duration: {
    start: Date;
    end: Date;
  };

  text: string;
  clientNumber: string;
};

export const announcements: AnnouncementEntity[] = [
  {
    location: "Saint Denis",
    workType: "Medecin",
    accommodation: true,
    clientNumber: "70-100",
    remuneration: "80/20",
    secretariat: true,
    vehicle: false,
    duration: {
      start: new Date("2024-12-02"),
      end: new Date("2024-12-06"),
    },
    text: "",
  },
];
