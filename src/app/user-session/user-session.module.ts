import { CookieModule, DatabaseModule } from "@common/helpers";
import { UserSession } from "@database/models";
import { Module } from "@nestjs/common";

import { UserSessionService } from "./user-session.service";

@Module({
    imports: [DatabaseModule.forFeature([UserSession]), CookieModule],
    providers: [UserSessionService],
    exports: [UserSessionService],
})
export class UserSessionModule {}
