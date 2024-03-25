import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { ExceptionResponse } from "@utils/helpers";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

    public catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        this.logger.log(request.url);
        this.logger.error(exception);
        const cause = exception.cause as any;
        cause && this.logger.error(cause?.message, cause?.stack);

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const reason = exception.getResponse();

        if (reason instanceof ExceptionResponse) {
            const { statusCode } = reason;
            response.status(statusCode).send(reason);
        } else {
            response.status(statusCode).send(reason);
        }
    }
}
