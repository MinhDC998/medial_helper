export const combineEndpoint = (prefix: string, endpoint: string): string => `${prefix}/${endpoint}`;

export const randomString = (): string => (Math.random() + 1).toString(36).substring(2);
