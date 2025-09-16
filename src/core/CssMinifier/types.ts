export interface MinifiedFile {
  content: string;
  basename: string;
  resultFilename: string;
}

export type BeforeFn = (options: HandleFilesOptions) => Promise<void> | void;

export type EachFn = (options: HandleFilesOptions, file: MinifiedFile) => Promise<void> | void;

export type DoneFn = (output: string, filesHandled: number) => Promise<void> | void;

export interface HandleFilesOptions {
  output: string;
  files: string[];
}
