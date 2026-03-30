import { useState, useEffect } from 'react';
import { LapTimeEntry } from './types';

const STORAGE_KEY = 'krzywa_lap_times';

const INITIAL_DATA: LapTimeEntry[] = [
  {
    id: '1',
    carName: 'Honda Civic Type R (FK8)',
    lapTimeMs: 112345, // 1:52.345
    weather: 'Słonecznie',
    tires: 'Semi-Slick',
    photoUrl: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=800&auto=format&fit=crop',
    isHidden: false,
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    carName: 'BMW M3 (G80)',
    lapTimeMs: 108500, // 1:48.500
    weather: 'Pochmurnie',
    tires: 'Slick',
    photoUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800&auto=format&fit=crop',
    isHidden: false,
    createdAt: Date.now() - 200000,
  },
  {
    id: '3',
    carName: 'Toyota GR Yaris',
    lapTimeMs: 115120, // 1:55.120
    weather: 'Deszcz',
    tires: 'Drogowe',
    photoUrl: 'https://images.unsplash.com/photo-1629897048514-3dd74142bfa8?q=80&w=800&auto=format&fit=crop',
    isHidden: true,
    createdAt: Date.now(),
  }
];

export function useLapTimes() {
  const [entries, setEntries] = useState<LapTimeEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        // Środowisko Electron - czytamy z pliku
        const stored = await window.electronAPI.readData();
        if (stored) {
          try {
            setEntries(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse stored lap times', e);
            setEntries(INITIAL_DATA);
          }
        } else {
          setEntries(INITIAL_DATA);
          await window.electronAPI.writeData(JSON.stringify(INITIAL_DATA));
        }
      } else {
        // Środowisko przeglądarki (fallback) - czytamy z localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setEntries(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse stored lap times', e);
            setEntries(INITIAL_DATA);
          }
        } else {
          setEntries(INITIAL_DATA);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        }
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  const saveEntries = async (newEntries: LapTimeEntry[]) => {
    setEntries(newEntries);
    if (window.electronAPI) {
      await window.electronAPI.writeData(JSON.stringify(newEntries));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    }
  };

  const addEntry = (entry: Omit<LapTimeEntry, 'id' | 'createdAt'>) => {
    const newEntry: LapTimeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    saveEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<LapTimeEntry>) => {
    saveEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter((entry) => entry.id !== id));
  };

  const toggleHidden = (id: string) => {
    saveEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isHidden: !entry.isHidden } : entry
      )
    );
  };

  return {
    entries,
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleHidden,
  };
}
