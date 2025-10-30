export declare class User {
    id: number;
    email: string;
    username: string;
    password: string;
    isAdmin: boolean;
    fullName?: string;
    phone?: string;
    avatar?: string;
    refreshToken?: string;
    lastLogin?: Date;
    lastLogout?: Date;
    lastRequestRefreshToken?: Date;
    isVerified: boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}
