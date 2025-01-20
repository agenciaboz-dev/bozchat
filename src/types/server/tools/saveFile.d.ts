import { FileUpload } from "../class/helpers";
export declare const saveFile: (path: string, file: FileUpload, callback?: () => void) => {
    url: string;
    filepath: string;
};
