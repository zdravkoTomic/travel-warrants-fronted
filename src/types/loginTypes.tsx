export interface IFormLoginValueErrors {
    [key: string]: string | undefined | null | boolean;

    email?: string | null;
    password?: string | null;
}

export interface IFormLoginValues {
    email: string;
    password: string;
}