import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    // Jika ini adalah default address, unset semua default address lainnya
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId },
        { isDefault: false }
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });

    return await this.addressRepository.save(address);
  }

  async findAll(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id, userId);

    // Jika ini adalah default address, unset semua default address lainnya
    if (updateAddressDto.isDefault) {
      await this.addressRepository
        .createQueryBuilder()
        .update(Address)
        .set({ isDefault: false })
        .where('userId = :userId AND id != :id', { userId, id })
        .execute();
    }

    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.remove(address);
  }

  async setDefault(id: number, userId: number): Promise<Address> {
    // Unset semua default address
    await this.addressRepository.update(
      { userId },
      { isDefault: false }
    );

    // Set address ini sebagai default
    const address = await this.findOne(id, userId);
    address.isDefault = true;
    return await this.addressRepository.save(address);
  }
}

