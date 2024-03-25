import { ApiType } from "@utils/types";

export interface WriteEndpointHandlerOptions {
    path?: string;
    body?: ApiType;
    response?: ApiType;
}
