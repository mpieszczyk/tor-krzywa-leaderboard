export interface LapTimeEntry {
  id: string;
  carName: string;
  lapTimeMs: number;
  weather: string;
  tires: string;
  photoUrl: string;
  isHidden: boolean;
  createdAt: number;
}

declare global {
  interface Window {
    electronAPI?: {
      readData: () => Promise<string | null>;
      writeData: (data: string) => Promise<boolean>;
    };
  }
}
