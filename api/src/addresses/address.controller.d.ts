import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(req: any, createAddressDto: CreateAddressDto): Promise<import("./address.entity").Address>;
    findAll(req: any): Promise<import("./address.entity").Address[]>;
    findOne(req: any, id: string): Promise<import("./address.entity").Address>;
    update(req: any, id: string, updateAddressDto: UpdateAddressDto): Promise<import("./address.entity").Address>;
    remove(req: any, id: string): Promise<void>;
    setDefault(req: any, id: string): Promise<import("./address.entity").Address>;
}
