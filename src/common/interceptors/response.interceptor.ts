import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { isHttpException } from "@utils/functions";
import { isObject } from "class-validator";
import { map } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    public intercept(_context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((response) => {
                if (isHttpException(response)) {
                    return response.getResponse();
                }
                return Array.isArray(response)
                    ? response.map((r) => this.prettifyResponse(r))
                    : this.prettifyResponse(response);
            })
        );
    }

    private prettifyResponse(response: any) {
        return isObject(response) && "toJSON" in response && typeof response.toJSON === "function"
            ? response.toJSON()
            : response;
    }
}
