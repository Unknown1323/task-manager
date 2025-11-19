export interface ElectronAPI {
    // Отримати порт NestJS сервера
    getServerPort: () => Promise<number>;

    // Керування вікном
    window: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        isMaximized: () => Promise<boolean>;
    };

    // Платформа
    platform: 'darwin' | 'win32' | 'linux';

    // Чи це Electron
    isElectron: true;
}

// Розширюємо Window інтерфейс
declare global {
    interface Window {
        electron?: ElectronAPI;
    }
}

export {};
