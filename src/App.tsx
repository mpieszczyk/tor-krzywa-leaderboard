import { useState, useEffect } from 'react';
import { useLapTimes } from './store';
import { Leaderboard } from './components/Leaderboard';
import { AdminPanel } from './components/AdminPanel';
import { AnimatePresence, motion } from 'motion/react';
import { Flag, Settings, Plus, LogOut } from 'lucide-react';
import { LapTimeEntry } from './types';

export default function App() {
  const { entries, isLoaded, addEntry, updateEntry, deleteEntry, toggleHidden } = useLapTimes();
  // W aplikacji desktopowej (lokalnej) użytkownik jest zawsze administratorem
  const isAdmin = true;
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LapTimeEntry | null>(null);

  if (!isLoaded) return null;

  const handleSave = (data: Omit<LapTimeEntry, 'id' | 'createdAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
    } else {
      addEntry(data);
    }
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleClose = () => {
    setIsAdding(false);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-[1280px] w-full mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-26 h-12 flex items-center justify-center overflow-hidden">
              <img src="https://torkrzywa.com/wp-content/uploads/2019/04/tor_krzywa_head.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                // Fallback to flag if logo is missing
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-red-600"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>';
              }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
                Tor <span className="text-red-600">Krzywa</span>
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Czasy Okrążeń Aut Widzów
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj Czas</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-4 py-12">
        <Leaderboard
          entries={entries}
          isAdmin={isAdmin}
          onToggleHidden={toggleHidden}
          onDelete={deleteEntry}
          onEdit={setEditingEntry}
        />
      </main>

      {/* Admin Modal */}
      <AnimatePresence>
        {(isAdding || editingEntry) && (
          <AdminPanel
            initialData={editingEntry || undefined}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
