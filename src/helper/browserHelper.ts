import { notificationService } from "@hope-ui/solid";

export const copyTextToClipboard = (textToCopy: string, maxTextLength: number = 100) => {
    try {
        navigator?.clipboard?.writeText?.(textToCopy);
        notificationService.clear();
        notificationService.show({
            status: "info",
            title: 'Copied!',
            description: (textToCopy.slice(0, maxTextLength) + (textToCopy.length > maxTextLength ? '...' : '')),
        });
    } catch {

    }
}