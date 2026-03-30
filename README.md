# Tor Krzywa Leaderboard 🏎️

Lokalna aplikacja desktopowa (Windows/Mac/Linux) do śledzenia i zarządzania czasami okrążeń na Torze Krzywa. Zbudowana w oparciu o **Electron**, **React**, **Vite** oraz **Tailwind CSS**.

Aplikacja działa w 100% offline. Wszystkie dane są bezpiecznie zapisywane w lokalnym pliku na komputerze użytkownika.

## 🌟 Funkcje
- Dodawanie nowych czasów okrążeń (kierowca/auto, czas, pogoda, opony).
- Automatyczne sortowanie wyników od najszybszego.
- Edycja i usuwanie wpisów.
- Ukrywanie wybranych czasów (np. nieoficjalnych lub testowych).
- Trwały zapis danych (dane nie znikają po przeniesieniu pliku `.exe`).

## 🛠️ Technologie
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Lucide React
- **Backend/Desktop:** Electron, IPC (Inter-Process Communication)
- **Bundler:** Vite
- **Budowanie aplikacji:** Electron Builder

---

## 🚀 Jak uruchomić projekt lokalnie (Development)

### Wymagania wstępne
- Zainstalowany [Node.js](https://nodejs.org/) (zalecana wersja LTS).

### Instalacja
1. Sklonuj to repozytorium na swój komputer:
   ```bash
   git clone <link-do-twojego-repozytorium>
   ```
2. Przejdź do folderu z projektem:
   ```bash
   cd krzywa-track-leaderboard
   ```
3. Zainstaluj wszystkie wymagane pakiety:
   ```bash
   npm install
   ```
4. Uruchom aplikację w trybie deweloperskim:
   ```bash
   npm run dev
   ```
   *Otworzy się okno aplikacji Electron z podpiętym przeładowywaniem na żywo (Hot Reload).*

---

## 📦 Jak zbudować gotową aplikację (.exe)

Aby wygenerować gotowy plik wykonywalny dla użytkownika końcowego (wersja Portable, niewymagająca instalacji):

1. Otwórz terminal w folderze projektu.
2. Uruchom komendę budującą:
   ```bash
   npm run build:electron
   ```
3. Gotowy plik znajdziesz w folderze **`release/`** (np. `Tor Krzywa Leaderboard 0.0.0.exe`).

### ⚠️ Rozwiązywanie problemów na Windowsie (Błąd tworzenia dowiązań)
Jeśli podczas budowania (`npm run build:electron`) napotkasz błąd podobny do:
> `ERROR: Cannot create symbolic link : Klient nie ma wymaganych uprawnień.`

**Rozwiązanie:**
Zamknij obecny terminal, otwórz Wiersz polecenia (`cmd`) lub PowerShell **jako Administrator** (Prawy przycisk myszy -> Uruchom jako administrator), przejdź do folderu z projektem (`cd ścieżka/do/projektu`) i uruchom komendę budującą ponownie.

---

## 💾 Gdzie zapisywane są dane?

Aplikacja zapisuje wszystkie czasy okrążeń w pliku `dane.json`. Plik ten znajduje się w bezpiecznym folderze systemowym użytkownika, co gwarantuje brak problemów z uprawnieniami do zapisu.

- **Windows:** `%APPDATA%\Tor Krzywa Leaderboard\dane.json`
- **macOS:** `~/Library/Application Support/Tor Krzywa Leaderboard/dane.json`
- **Linux:** `~/.config/Tor Krzywa Leaderboard/dane.json`

Dzięki temu możesz swobodnie przenosić plik `.exe` w dowolne miejsce na dysku (np. na pulpit czy pendrive), a Twoje dane pozostaną nienaruszone.

---

## 📝 Licencja
Projekt stworzony na własne potrzeby. Możesz go dowolnie modyfikować i dostosowywać do swoich wymagań.
