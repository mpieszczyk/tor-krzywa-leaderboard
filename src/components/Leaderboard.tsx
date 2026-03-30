import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LapTimeEntry } from '../types';
import { cn } from '../lib/utils';
import { Cloud, CloudRain, Snowflake, Sun, Eye, EyeOff, Trophy, Trash2, Edit2 } from 'lucide-react';

interface LeaderboardProps {
  entries: LapTimeEntry[];
  isAdmin: boolean;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: LapTimeEntry) => void;
}

export function formatLapTime(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

const WeatherIcon = ({ weather }: { weather: string }) => {
  switch (weather.toLowerCase()) {
    case 'słonecznie': return <Sun className="w-4 h-4 text-white" />;
    case 'pochmurnie': return <Cloud className="w-4 h-4 text-zinc-400" />;
    case 'deszcz': return <CloudRain className="w-4 h-4 text-blue-400" />;
    case 'śnieg': return <Snowflake className="w-4 h-4 text-blue-200" />;
    default: return <Sun className="w-4 h-4 text-white" />;
  }
};

export function Leaderboard({ entries, isAdmin, onToggleHidden, onDelete, onEdit }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => a.lapTimeMs - b.lapTimeMs);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[1280px] w-full mx-auto">
      <div className="bg-black/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-[40px_120px_1fr_120px_120px_160px_auto] gap-4 p-4 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider items-center">
          <div className="text-center">Poz.</div>
          <div>Zdjęcie</div>
          <div>Samochód</div>
          <div>Opony</div>
          <div>Pogoda</div>
          <div className="text-right">Czas</div>
          {isAdmin && <div className="w-20 text-center">Akcje</div>}
        </div>

        <div className="divide-y divide-zinc-800/50">
          <AnimatePresence mode="popLayout">
            {sortedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className={cn(
                  "grid grid-cols-[40px_120px_1fr_120px_120px_160px_auto] gap-4 p-4 items-center group hover:bg-zinc-900/50 transition-colors",
                  index === 0 && "bg-red-600/5 hover:bg-red-600/10"
                )}
              >
                <div className="text-center font-mono text-xl font-bold text-zinc-500 flex justify-center">
                  {index === 0 ? <Trophy className="w-6 h-6 text-red-600" /> : index + 1}
                </div>

                <div className="w-30 h-16 rounded-md overflow-hidden relative">
                  {entry.photoUrl ? (
                    <img src={entry.photoUrl} alt={entry.carName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Brak</div>
                  )}
                </div>

                <div className="font-bold text-white text-lg truncate">
                  {entry.carName}
                </div>

                <div className="text-sm text-zinc-400">
                  <span className="px-2 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50">
                    {entry.tires}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <WeatherIcon weather={entry.weather} />
                  <span className="capitalize">{entry.weather}</span>
                </div>

                <div className="text-right relative flex justify-end items-center">
                  {entry.isHidden ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => isAdmin && onToggleHidden(entry.id)}
                      className={cn(
                        "font-mono text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 blur-[6px] select-none transition-all duration-500",
                        isAdmin && "cursor-pointer hover:blur-[4px]"
                      )}
                    >
                      0:00.000
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ filter: 'blur(10px)', opacity: 0, scale: 0.9 }}
                      animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "font-mono text-2xl font-black tracking-tighter",
                        index === 0 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-zinc-100"
                      )}
                    >
                      {formatLapTime(entry.lapTimeMs)}
                    </motion.div>
                  )}
                  {entry.isHidden && isAdmin && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded uppercase tracking-widest shadow-lg">Ukryty</span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="w-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleHidden(entry.id)}
                      className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title={entry.isHidden ? "Odkryj Czas" : "Ukryj Czas"}
                    >
                      {entry.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onEdit(entry)}
                      className="p-2 rounded-lg hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-colors"
                      title="Edytuj Wpis"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {confirmDeleteId === entry.id ? (
                      <button
                        onClick={() => { onDelete(entry.id); setConfirmDeleteId(null); }}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors font-bold text-xs"
                        title="Potwierdź usunięcie"
                      >
                        Usuń
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(entry.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Usuń Wpis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {sortedEntries.length === 0 && (
              <div className="p-12 text-center text-zinc-500 italic">
                Brak zapisanych czasów okrążeń.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
