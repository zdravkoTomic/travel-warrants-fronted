export interface IFormResetPasswordValueErrors {
    [key: string]: string | undefined | null | boolean;

    password?: string | null;
    password_confirm?: string | null;
}

export interface IFormResetPasswordValues {
    email: string;
    password: string;
    password_confirm: string;
}