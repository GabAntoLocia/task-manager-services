import { User } from '../entities/user.entity';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    updateRefreshToken(userId: string, hashedToken: string): Promise<void>;
    removeRefreshToken(userId: string): Promise<void>;
    getProfile(userId: string): Promise<User | null>;
}