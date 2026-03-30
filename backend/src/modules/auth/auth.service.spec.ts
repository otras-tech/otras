import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: JwtService,
                    useValue: {},
                },
                {
                    provide: ConfigService,
                    useValue: {},
                },
                {
                    provide: PrismaService,
                    useValue: {
                        refreshToken: {
                            deleteMany: jest.fn(),
                            findUnique: jest.fn(),
                            delete: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
