import { Meta } from "./meta";

export interface HttpResponseList<T> {
    data: T[];
    meta: Meta;
}
