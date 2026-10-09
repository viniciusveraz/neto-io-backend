import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDTO) {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (userAlreadyExists) {
      throw new AppError('Este endereço de e-mail já está cadastrado no sistema.', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        avatarUrl: data.avatarUrl,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas. Verifique seu e-mail e senha.', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas. Verifique seu e-mail e senha.', 401);
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            touristSpot: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  private generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      {
        email,
        role,
      },
      env.jwtSecret,
      {
        subject: userId,
        expiresIn: '7d',
      }
    );
  }
}
