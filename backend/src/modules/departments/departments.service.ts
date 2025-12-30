// src/modules/departments/departments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto'; // ADD THIS IMPORT

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentModel
      .findOne({ name: createDepartmentDto.name })
      .exec();
    if (existing) {
      throw new BadRequestException('Department already exists');
    }

    const department = new this.departmentModel(createDepartmentDto);
    return department.save();
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  // FIX THIS METHOD - Change parameter type
  async update(
    id: string,
    updateData: UpdateDepartmentDto, // CHANGE THIS LINE
  ): Promise<Department> {
    const department = await this.departmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async delete(id: string): Promise<void> {
    const result = await this.departmentModel
      .findByIdAndUpdate(id, { isActive: false })
      .exec();
    if (!result) {
      throw new NotFoundException('Department not found');
    }
  }
}
