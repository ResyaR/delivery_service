import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressService {
    private addressRepository;
    constructor(addressRepository: Repository<Address>);
    create(userId: number, createAddressDto: CreateAddressDto): Promise<Address>;
    findAll(userId: number): Promise<Address[]>;
    findOne(id: number, userId: number): Promise<Address>;
    update(id: number, userId: number, updateAddressDto: UpdateAddressDto): Promise<Address>;
    remove(id: number, userId: number): Promise<void>;
    setDefault(id: number, userId: number): Promise<Address>;
}
