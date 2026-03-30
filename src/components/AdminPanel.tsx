import React, { useState, useRef } from 'react';
import { LapTimeEntry } from '../types';
import { motion } from 'motion/react';
import { Upload, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  onSave: (entry: Omit<LapTimeEntry, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initialData?: LapTimeEntry;
}

export function AdminPanel({ onSave, onClose, initialData }: AdminPanelProps) {
  const [carName, setCarName] = useState(initialData?.carName || '');
  const [minutes, setMinutes] = useState(initialData ? Math.floor(initialData.lapTimeMs / 60000).toString() : '0');
  const [seconds, setSeconds] = useState(initialData ? Math.floor((initialData.lapTimeMs % 60000) / 1000).toString().padStart(2, '0') : '00');
  const [milliseconds, setMilliseconds] = useState(initialData ? (initialData.lapTimeMs % 1000).toString().padStart(3, '0') : '000');
  const [weather, setWeather] = useState(initialData?.weather || 'Słonecznie');
  const [tires, setTires] = useState(initialData?.tires || 'Slick');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '');
  const [isHidden, setIsHidden] = useState(initialData?.isHidden ?? true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMs = 
      (parseInt(minutes) || 0) * 60000 + 
      (parseInt(seconds) || 0) * 1000 + 
      (parseInt(milliseconds) || 0);

    onSave({
      carName,
      lapTimeMs: totalMs,
      weather,
      tires,
      photoUrl,
      isHidden,
    });

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <div className="bg-black border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edytuj Czas Okrążenia' : 'Dodaj Nowy Czas Okrążenia'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Nazwa Samochodu</label>
              <input
                required
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="np. Honda Civic Type R (FK8)"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Czas Okrążenia</label>
              <div className="flex items-center gap-2">
                <input
                  required
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-20 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="MM"
                />
                <span className="text-zinc-500 font-bold">:</span>
                <input
                  required
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  onBlur={(e) => setSeconds(e.target.value.padStart(2, '0'))}
                  className="w-20 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="SS"
                />
                <span className="text-zinc-500 font-bold">.</span>
                <input
                  required
                  type="number"
                  min="0"
                  max="999"
                  value={milliseconds}
                  onChange={(e) => setMilliseconds(e.target.value)}
                  onBlur={(e) => setMilliseconds(e.target.value.padStart(3, '0'))}
                  className="w-24 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="MS"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Pogoda</label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50"
                >
                  <option value="Słonecznie">Słonecznie</option>
                  <option value="Pochmurnie">Pochmurnie</option>
                  <option value="Deszcz">Deszcz</option>
                  <option value="Śnieg">Śnieg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Opony</label>
                <select
                  value={tires}
                  onChange={(e) => setTires(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50"
                >
                  <option value="Slick">Slick</option>
                  <option value="Semi-Slick">Semi-Slick</option>
                  <option value="UHP">UHP</option>
                  <option value="Drogowe">Drogowe</option>
                  <option value="Zimowe">Zimowe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Zdjęcie Samochodu</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 transition-colors overflow-hidden relative group",
                  photoUrl && "border-solid border-zinc-700"
                )}
              >
                {photoUrl ? (
                  <>
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold text-white">
                      Zmień Zdjęcie
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                    <span className="text-sm text-zinc-500 font-medium">Kliknij, aby wgrać zdjęcie</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-black/50 rounded-xl border border-zinc-800/50">
              <input
                type="checkbox"
                id="isHidden"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 text-red-600 focus:ring-red-600/50 focus:ring-offset-zinc-900 bg-zinc-900"
              />
              <label htmlFor="isHidden" className="text-sm font-medium text-zinc-300 cursor-pointer select-none">
                Ukryj czas początkowo (do odsłonięcia na filmie)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <Plus className="w-5 h-5" />
              {initialData ? 'Zapisz Zmiany' : 'Zapisz Czas Okrążenia'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
