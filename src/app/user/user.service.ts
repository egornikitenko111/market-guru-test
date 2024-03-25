import { UUID } from "node:crypto";

import { UnknownError, UserCreatingError, UserNotFoundError } from "@common/errors";
import { User } from "@database/models";
import { InjectRepository } from "@decorators/sequelize";
import { CreateUserDto, UpdateUserDto } from "@dtos/user";
import { FindUsersFilterDto } from "@dtos/user";
import { UserAttributes } from "@interfaces/models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { pipe } from "@utils/functions";
import { PaginatedResponse } from "@utils/helpers";
import { BaseError, FindOptions, Op, WhereOptions } from "sequelize";
import { Repository } from "sequelize-typescript";

@Injectable()
export class UserService {
    private readonly defaultPaginationLimit: number;

    public constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
    ) {
        this.defaultPaginationLimit = parseInt(
            this.configService.getOrThrow<string>("DEFAULT_PAGINATION_LIMIT"),
            10
        );
    }

    public async create(dto: CreateUserDto): Promise<void | UserCreatingError | UnknownError> {
        try {
            await this.userRepository.create(dto);
        } catch (e) {
            if (e instanceof BaseError) {
                return new UserCreatingError(e);
            }
            return new UnknownError(e);
        }
    }

    public async getAll(dto: FindUsersFilterDto) {
        try {
            const { offset, limit, currentPage } = await this.getPaginationOptions(dto);
            const where = this.getWhereOptions(dto);

            const users = await this.userRepository.findAll({
                offset: offset,
                limit: limit,
                where: where,
            });

            const totalRows = users.length;
            const totalPages = Math.max(Math.ceil(totalRows / limit), 1);

            return new PaginatedResponse(totalPages, totalRows, currentPage, users);
        } catch (e) {
            return new UnknownError(e);
        }
    }

    public async getOneById(id: UUID): Promise<User | UserNotFoundError | UnknownError> {
        return this.getOneOrFail({ where: { id } });
    }

    public async getOneByPhone(phone: string): Promise<User | UserNotFoundError | UnknownError> {
        return this.getOneOrFail({ where: { phone } });
    }

    public async getOneByEmail(email: string): Promise<User | UserNotFoundError | UnknownError> {
        return this.getOneOrFail({ where: { email } });
    }

    public async update(id: UUID, dto: UpdateUserDto): Promise<void | UnknownError> {
        try {
            await this.userRepository.update({ ...dto, updatedAt: new Date() }, { where: { id } });
        } catch (e) {
            return new UnknownError(e);
        }
    }

    public async delete(id: UUID): Promise<void | UnknownError> {
        try {
            await this.userRepository.destroy({ where: { id } });
        } catch (e) {
            return new UnknownError(e);
        }
    }

    private async getOneOrFail(
        options: FindOptions<UserAttributes>
    ): Promise<User | UserNotFoundError | UnknownError> {
        try {
            const user = await this.userRepository.findOne(options);
            if (!user) {
                return new UserNotFoundError();
            }
            return user;
        } catch (e) {
            return new UnknownError(e);
        }
    }

    private async getPaginationOptions(dto: FindUsersFilterDto) {
        const { page: currentPage = 1, limit = this.defaultPaginationLimit } = dto;
        const offset = currentPage * limit - limit;
        return { offset, limit, currentPage };
    }

    private getWhereOptions({
        emails,
        phones,
        firstNames,
        lastNames,
        middleNames,
    }: FindUsersFilterDto) {
        const getEmailOptions = (
            where: WhereOptions<UserAttributes> | undefined
        ): WhereOptions<UserAttributes> | undefined => {
            if (!emails?.length) {
                return where;
            }
            return Object.assign({}, where, {
                email: emails.length > 1 ? { [Op.in]: emails } : { [Op.eq]: emails[0] },
            });
        };
        const getPhoneOptions = (
            where: WhereOptions<UserAttributes> | undefined
        ): WhereOptions<UserAttributes> | undefined => {
            if (!phones?.length) {
                return where;
            }
            return Object.assign({}, where, {
                phone: phones.length > 1 ? { [Op.in]: phones } : { [Op.eq]: phones[0] },
            });
        };
        const getFirstNameOptions = (
            where: WhereOptions<UserAttributes> | undefined
        ): WhereOptions<UserAttributes> | undefined => {
            if (!firstNames?.length) {
                return where;
            }
            return Object.assign({}, where, {
                firstName:
                    firstNames.length > 1 ? { [Op.in]: firstNames } : { [Op.eq]: firstNames[0] },
            });
        };
        const geLastNameOptions = (
            where: WhereOptions<UserAttributes> | undefined
        ): WhereOptions<UserAttributes> | undefined => {
            if (!lastNames?.length) {
                return where;
            }
            return Object.assign({}, where, {
                lastName: lastNames.length > 1 ? { [Op.in]: lastNames } : { [Op.eq]: lastNames[0] },
            });
        };
        const geMiddleNameOptions = (
            where: WhereOptions<UserAttributes> | undefined
        ): WhereOptions<UserAttributes> | undefined => {
            if (!middleNames?.length) {
                return where;
            }
            return Object.assign({}, where, {
                middleName:
                    middleNames.length > 1 ? { [Op.in]: middleNames } : { [Op.eq]: middleNames[0] },
            });
        };

        const where: WhereOptions<UserAttributes> | undefined = undefined;

        const build = pipe(
            getEmailOptions,
            getPhoneOptions,
            getFirstNameOptions,
            geLastNameOptions,
            geMiddleNameOptions
        );

        return build(where);
    }
}
