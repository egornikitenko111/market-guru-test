import { Prettify } from "@utils/types";

import { SetCookieType } from "./set.cookie.type";

export type ClearCookieType = Prettify<
    Pick<SetCookieType, "key"> & Partial<Pick<SetCookieType, "options">>
>;
