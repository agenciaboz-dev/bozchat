import { WithoutFunctions } from "./helpers";
export declare enum HandledErrorCode {
    no_nagazap = 1
}
export declare class HandledError {
    text: string;
    code: HandledErrorCode;
    constructor(data: WithoutFunctions<HandledError>);
}
