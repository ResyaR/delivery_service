import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AdminTokenDto } from '../common/dto/admin-token.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(adminTokenDto: AdminTokenDto): Promise<{
        id: number;
        email: string;
        username: string;
        fullName: string | undefined;
        phone: string | undefined;
        avatar: string | undefined;
        lastLogin: Date | undefined;
        lastLogout: Date | undefined;
        lastRequestRefreshToken: Date | undefined;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateUserByAdmin(id: number, updateData: {
        fullName?: string;
        phone?: string;
        avatar?: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string | undefined;
            phone: string | undefined;
            avatar: string | undefined;
        };
    }>;
    deleteUserByAdmin(id: number): Promise<{
        message: string;
        userId: number;
    }>;
    deleteUser(req: any, deleteUserDto: DeleteUserDto): Promise<{
        message: string;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        message: string;
        data: import("./user.entity").User | null;
    }>;
    updateAvatar(req: any, file: any): Promise<{
        message: string;
        data: {
            id: number;
            email: string;
            avatarUrl: string | undefined;
        };
    }>;
    private saveFile;
}
