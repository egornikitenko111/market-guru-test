import { ReqBodyValidationError } from "@common/errors";
import { HttpExceptionFilter } from "@common/exception-filters";
import { ResponseInterceptor, TimeoutInterceptor } from "@common/interceptors";
import {
    ClassSerializerInterceptor,
    Logger,
    ValidationError,
    ValidationPipe,
    VersioningOptions,
    VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { version } from "@package.json";
import compression from "compression";
import cookieParser from "cookie-parser";

import { AppModule } from "./app/app.module";

async function bootstrap() {
    const [majorVersion] = version.split(".", 1);

    const validationPipe = new ValidationPipe({
        whitelist: true,
        enableDebugMessages: true,
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => new ReqBodyValidationError(errors),
    });

    const versioningOptions: VersioningOptions = {
        type: VersioningType.URI,
        defaultVersion: majorVersion,
    };

    const app = await NestFactory.create(AppModule);

    app.use(compression(), cookieParser());

    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);

    const apiPrefix = configService.getOrThrow<string>("API_PREFIX");
    const docsPrefix = configService.getOrThrow<string>("DOCS_PREFIX");
    const port = parseInt(configService.getOrThrow("PORT"), 10);
    const defaultRequestTimeout = parseInt(configService.getOrThrow("DEFAULT_REQUEST_TIMEOUT"), 10);

    app.enableVersioning(versioningOptions)
        .useGlobalPipes(validationPipe)
        .useGlobalFilters(new HttpExceptionFilter())
        .useGlobalInterceptors(
            new ClassSerializerInterceptor(reflector),
            new TimeoutInterceptor(defaultRequestTimeout),
            new ResponseInterceptor()
        )
        .setGlobalPrefix(apiPrefix)
        .enableCors();

    const docsConfig = new DocumentBuilder()
        .setTitle("API documentation")
        .setVersion(version)
        .addBearerAuth({ type: "http" })
        .build();

    const document = SwaggerModule.createDocument(app, docsConfig);
    SwaggerModule.setup(docsPrefix, app, document);

    await app.listen(port, () => Logger.log(`Server started on port ${port}`, "NestApplication"));
}
bootstrap();
