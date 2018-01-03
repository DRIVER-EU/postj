import { ICommandOptions } from './cli';
export declare class PostService {
    private options;
    constructor(options: ICommandOptions);
    private sendFile(filename);
    private getHeaderOptions();
}
