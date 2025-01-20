export interface ConvertFileOptions {
    file?: ArrayBuffer;
    base64?: string;
    original_path?: string;
    output_format: string;
    input_format?: string;
    returnBase64?: boolean;
    customArgs?: string[];
}
export declare const convertFile: (data: ConvertFileOptions) => Promise<Buffer | string>;
