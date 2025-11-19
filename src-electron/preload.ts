import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload скрипт - безпечний міст між main і renderer процесами
 * Використовуємо contextBridge для безпечного доступу до Electron API
 */

// API для renderer процесу
const electronAPI = {
    // Отримати порт NestJS сервера
    getServerPort: (): Promise<number> => {
        return ipcRenderer.invoke('get-server-port');
    },

    // Керування вікном
    window: {
        minimize: () => ipcRenderer.send('window-minimize'),
        maximize: () => ipcRenderer.send('window-maximize'),
        close: () => ipcRenderer.send('window-close'),
        isMaximized: (): Promise<boolean> => ipcRenderer.invoke('is-maximized'),
    },

    // Інформація про платформу
    platform: process.platform,

    // Перевірка чи це Electron середовище
    isElectron: true,
};

// Експонуємо API в renderer через contextBridge
contextBridge.exposeInMainWorld('electron', electronAPI);

// TypeScript типи експортуємо окремо в electron.d.ts
export type ElectronAPI = typeof electronAPI;
