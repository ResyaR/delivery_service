export declare class User {
    id: number;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    avatar?: string;
    refreshToken?: string;
    lastLogin?: Date;
    lastLogout?: Date;
    lastRequestRefreshToken?: Date;
}
