export declare class LoginResponseDto {
    message: string;
    access_token: string;
    refresh_token: string;
    refresh_token_expires_in: number;
    expires_in: number;
    token_type: string;
    user: {
        id: number;
        email: string;
    };
}
export declare class RegisterResponseDto {
    message: string;
    user: {
        id: number;
        email: string;
    };
}
export declare class RefreshResponseDto {
    message: string;
    access_token: string;
    expires_in: number;
    token_type: string;
    user: {
        id: number;
        email: string;
    };
}
export declare class ProfileResponseDto {
    message: string;
    email: string;
    fullName?: string;
    phone?: string;
    avatar?: string;
}
export declare class LogoutResponseDto {
    message: string;
}
