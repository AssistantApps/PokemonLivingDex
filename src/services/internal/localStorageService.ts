import { Container, Service } from 'typedi';
import { CacheKey } from '../../constants/cacheKey';

@Service()
export class LocalStorageService {

    constructor() {
        for (const key in localStorage) {
            if (key.includes(CacheKey.getPokemonByTypes)) {
                localStorage.removeItem(key);
            }
        }
    }

    get = <T>(key: string): T | null => {
        const dataStr = localStorage.getItem(key);
        if (dataStr == null) return null;
        try {
            const obj = JSON.parse(dataStr || '{}');
            return obj;
        } catch (err) {
            console.error('LocalStorageService get', err)
            return null;
        }
    };

    set = <T>(key: string, value: T): void => {
        try {
            const valueStr = JSON.stringify(value);
            localStorage.setItem(key, valueStr);
        } catch (err) {
            console.error('LocalStorageService set', err)
        }
    };
}

export const getStorage = () => Container.get(LocalStorageService);
