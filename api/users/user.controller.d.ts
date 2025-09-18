import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<{
        id: number;
        email: string;
        fullName: string | undefined;
        phone: string | undefined;
        avatar: string | undefined;
        lastLogin: Date | undefined;
        lastLogout: Date | undefined;
        lastRequestRefreshToken: Date | undefined;
    }[]>;
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
