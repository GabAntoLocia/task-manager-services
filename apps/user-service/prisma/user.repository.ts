import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../src/domain/interfaces/user-repository.interface';
import { User } from '../src/domain/entities/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    try {
      const data = await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
        },
      });

      return new User(
        data.id,
        data.name,
        data.email,
        data.password,
        data.createdAt
      );
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const data = await this.prisma.user.findUnique({ 
        where: { email } 
      });
      return data ? this.toDomainEntity(data) : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const data = await this.prisma.user.findUnique({ 
        where: { id } 
      });
      return data ? this.toDomainEntity(data) : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const data = await this.prisma.user.findMany();
      return data.map(this.toDomainEntity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to list users');
    }
  }

  async updateRefreshToken(userId: string, hashedToken: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken: hashedToken },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Failed to update refresh token');
    }
  }
  
  async removeRefreshToken(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken: null },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Failed to remove refresh token');
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    try {
      const data = await this.prisma.user.findUnique({ 
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });
      return data ? this.toDomainEntity(data) : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get user profile');
    }
  }

  private toDomainEntity(data: any): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.password,
      data.createdAt
    );
  }
}