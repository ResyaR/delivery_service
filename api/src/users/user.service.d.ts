import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PendingUser } from './entities/pending-user.entity';
export declare class UserService {
    private userRepository;
    private pendingUserRepository;
    constructor(userRepository: Repository<User>, pendingUserRepository: Repository<PendingUser>);
    create(email: string, username: string, password: string): Promise<User>;
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    private getWIBDate;
    updateLoginStatus(userId: number): Promise<void>;
    updateLogoutStatus(userId: number): Promise<void>;
    updateRefreshTokenRequest(userId: number): Promise<void>;
    updateProfile(id: number, dto: Partial<User>): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    setRefreshToken(userId: number, refreshToken: string): Promise<void>;
    findByRefreshToken(refreshToken: string): Promise<User | null>;
    isUserLoggedOut(userId: number): Promise<boolean>;
    deleteUser(userId: number): Promise<void>;
    updateVerificationStatus(userId: number, isVerified: boolean): Promise<void>;
    deleteAllUsers(): Promise<void>;
    createPendingUser(email: string, username: string, password: string): Promise<PendingUser>;
    findPendingUser(email: string): Promise<PendingUser | null>;
    deletePendingUser(email: string): Promise<void>;
}
