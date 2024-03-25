import { User, UserSession } from "@database/models";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRepositoryToken } from "@utils/functions";
import { Model, Sequelize } from "sequelize-typescript";

@Module({})
export class DatabaseModule {
    public static forRoot(): DynamicModule {
        const sequelizeProvider = {
            provide: "SEQUELIZE",
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const sequelize = new Sequelize({
                    dialect: "postgres",
                    host: configService.getOrThrow<string>("POSTGRES_HOST"),
                    port: parseInt(configService.getOrThrow<string>("POSTGRES_PORT"), 10),
                    username: configService.getOrThrow<string>("POSTGRES_USER"),
                    password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
                    database: configService.getOrThrow<string>("POSTGRES_DB"),
                    minifyAliases: true,
                    models: [User, UserSession],
                });
                return sequelize;
            },
        } satisfies Provider;
        return {
            module: DatabaseModule,
            providers: [sequelizeProvider],
            exports: [sequelizeProvider],
        };
    }

    public static forFeature<TModel extends typeof Model<any, any>>(
        models: TModel[]
    ): DynamicModule {
        const providers: Provider[] = models.map((model) => ({
            provide: createRepositoryToken(model),
            useValue: model,
        }));
        return { module: DatabaseModule, providers: providers, exports: providers };
    }
}
