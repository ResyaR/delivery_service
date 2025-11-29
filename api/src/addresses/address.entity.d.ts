import { User } from '../users/user.entity';
export declare class Address {
    id: number;
    userId: number;
    user: User;
    label: string;
    recipientName: string;
    street: string;
    city: string;
    cityId: number;
    province: string;
    postalCode: string;
    zone: number;
    note: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
