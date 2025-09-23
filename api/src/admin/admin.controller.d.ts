import { UserService } from '../users/user.service';
export declare class AdminController {
    private readonly userService;
    constructor(userService: UserService);
    deleteAllUsers(adminKey: string): Promise<{
        message: string;
    }>;
}
