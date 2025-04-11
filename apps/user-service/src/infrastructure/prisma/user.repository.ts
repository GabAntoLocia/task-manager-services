import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      },
    });

    return new User(data.id, data.name, data.email, data.password, data.createdAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return new User(data.id, data.name, data.email, data.password, data.createdAt);
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return new User(data.id, data.name, data.email, data.password, data.createdAt);
  }

  async findAll(): Promise<User[]> {
    const data = await this.prisma.user.findMany();
    return data.map((user) => new User(user.id, user.name, user.email, user.password, user.createdAt));
  }

  async updateRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken : hashedToken },
    });
  }
  
  async removeRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async getProfile(userId: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!data) return null;
    return new User(data.id, data.name, data.email, data.password, data.createdAt);
  }
}