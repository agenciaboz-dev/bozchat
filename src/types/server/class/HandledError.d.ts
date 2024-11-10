import { WithoutFunctions } from "./helpers";
export declare enum HandledErrorCode {
    nagazap_not_found = 1,
    nagazap_no_info = 2
}
export declare class HandledError {
    text: string;
    code: HandledErrorCode;
    constructor(data: WithoutFunctions<HandledError>);
}
