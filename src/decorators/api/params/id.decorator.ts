import { Param, ParseUUIDPipe } from "@nestjs/common";

export const Id = (name: string = "id") => Param(name, ParseUUIDPipe);
