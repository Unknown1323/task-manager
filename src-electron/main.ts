import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

// Визначаємо режим розробки
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

async function createWindow() {
    console.log('🚀 Starting Electron app...');
    console.log('📁 App path:', app.getAppPath());
    console.log('🔧 Development mode:', isDev);

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset', // Кастомний titlebar для macOS
        frame: process.platform === 'darwin', // Native frame для macOS
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Безпека
            contextIsolation: true, // Ізоляція контексту
            sandbox: false, // Потрібно для доступу до Node.js API
        },
        backgroundColor: '#0f172a', // Slate-900 для темної теми
        show: false, // Покажемо після завантаження
    });

    // Показуємо вікно тільки після ready-to-show
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    const startUrl = 'http://localhost:3000';

    console.log('🌐 Loading URL:', startUrl);

    try {
        await mainWindow.loadURL(startUrl);

        // Відкриваємо DevTools в режимі розробки
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    } catch (error) {
        console.error('❌ Failed to load URL:', error);
    }

    // Обробка закриття вікна
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // IPC handlers
    setupIpcHandlers();
}

function setupIpcHandlers() {
    // Мінімізація вікна
    ipcMain.on('window-minimize', () => {
        mainWindow?.minimize();
    });

    // Максимізація/відновлення вікна
    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });

    // Закриття вікна
    ipcMain.on('window-close', () => {
        mainWindow?.close();
    });

    // Перевірка чи максимізоване вікно
    ipcMain.handle('is-maximized', () => {
        return mainWindow?.isMaximized() || false;
    });
}

// Готовність Electron
app.whenReady().then(async () => {
    await createWindow();

    // macOS: створити вікно якщо активовано але вікон немає
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Закриття всіх вікон (Windows & Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Обробка помилок
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('💥 Unhandled Rejection:', error);
});
