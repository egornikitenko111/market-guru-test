import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_ENDPOINT } from "@utils/constants";

export const PublicEndpoint = () => SetMetadata(IS_PUBLIC_ENDPOINT, true);
