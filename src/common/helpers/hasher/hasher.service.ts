import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class HasherService {
    private readonly hashRounds: number;

    public constructor(configService: ConfigService) {
        this.hashRounds = parseInt(configService.getOrThrow<string>("BCRYPT_HASH_ROUNDS"), 10);
    }

    public async hashAsync(value: string): Promise<string> {
        return bcrypt.hash(value, this.hashRounds);
    }

    public hashSync(value: string): string {
        return bcrypt.hashSync(value, this.hashRounds);
    }

    public async compare(value: string, hashedValue: string): Promise<boolean> {
        if (!value || !hashedValue) {
            return false;
        }
        return bcrypt.compare(value, hashedValue);
    }
}
