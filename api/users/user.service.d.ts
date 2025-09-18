import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(email: string, password: string): Promise<User>;
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    updateLoginStatus(userId: number): Promise<void>;
    updateLogoutStatus(userId: number): Promise<void>;
    updateRefreshTokenRequest(userId: number): Promise<void>;
    updateProfile(id: number, dto: Partial<User>): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    setRefreshToken(userId: number, refreshToken: string): Promise<void>;
    findByRefreshToken(refreshToken: string): Promise<User | null>;
    isUserLoggedOut(userId: number): Promise<boolean>;
    deleteUser(userId: number): Promise<void>;
}
