import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plik z danymi będzie zapisywany w folderze z danymi aplikacji użytkownika,
// co gwarantuje, że aplikacja będzie miała uprawnienia do zapisu po zainstalowaniu.
const dataFilePath = path.join(app.getPath('userData'), 'dane.json');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // W środowisku deweloperskim Vite serwuje pliki na VITE_DEV_SERVER_URL
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // W produkcji ładujemy zbudowany plik index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Obsługa zapisu i odczytu danych z pliku JSON
ipcMain.handle('read-data', async () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return data;
    }
    return null;
  } catch (error) {
    console.error('Błąd odczytu pliku:', error);
    return null;
  }
});

ipcMain.handle('write-data', async (_, data: string) => {
  try {
    fs.writeFileSync(dataFilePath, data, 'utf-8');
    return true;
  } catch (error) {
    console.error('Błąd zapisu pliku:', error);
    return false;
  }
});
