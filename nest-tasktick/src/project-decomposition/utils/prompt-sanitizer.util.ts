/**
 * Utility functions for sanitizing user inputs before including them in AI prompts
 */

/**
 * Sanitizes a string to prevent prompt injection attacks
 * - Removes control characters that could manipulate prompt format
 * - Escapes potential instruction markers
 */
export function sanitizePromptInput(input: string): string {
    if (!input) return '';

    return input
        // Replace newlines with spaces to prevent format manipulation
        .replace(/\r?\n|\r/g, ' ')
        // Escape common prompt injection markers
        .replace(/(\bsystem\b|\buser\b|\bassistant\b|\bprompt\b|\binstructions?\b|\bignore\b)/gi,
            (match) => `[filtered:${match}]`)
        // Escape potential escape sequences
        .replace(/\\+/g, '\\\\')
        // Remove control characters
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        // Limit extremely long inputs
        .slice(0, 1000);
}

/**
 * Sanitizes all user-provided fields in an object 
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    // Create a mutable copy of the object with an explicit index signature
    const result: Record<string, any> = { ...obj };

    for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'string') {
            result[key] = sanitizePromptInput(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value);
        }
    }

    // Cast back to the original type
    return result as T;
} 