/**
 * Crée une fonction debounced qui attend un délai avant d'exécuter la fonction
 * @param fn La fonction à debouncer
 * @param delay Le délai en millisecondes (défaut: 300ms)
 * @returns La fonction debounced
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}


