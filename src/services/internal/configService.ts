import { Container, Service, Token } from "typedi";

@Service()
export class ConfigService {
    getAssistantAppsUrl = (): string => this.get<string>('VITE_AA_API_URL');
    getAATranslationImageUrl = (): string => this.get<string>('VITE_AA_TRANSLATION_IMAGE_BASE_URL');
    getGoogleClientId = (): string => this.get<string>('VITE_GOOGLE_CLIENT_ID');

    get<T>(property: string): T {
        return (import.meta.env?.[property] ?? '') as T;
    };

    isProd = () => this.get<string>('NODE_ENV') === 'production';
    buildVersion = () => this.get<string>('BUILD_VERSION');
}

export const BOT_PATH = new Token<string>('BOT_PATH');
export const getBotPath = () => Container.get(BOT_PATH);

export const getConfig = () => Container.get(ConfigService);
