export declare class FunctionMethod {
	LogLogin: () => void;
	getBuffer: (url: string) => Promise<Buffer>;
	getUrl: (Link: string) =>  RegExpMatchArray | null;
	Tunggu: (ms: number) => Promise <unknown>;
	RandomName: (jumlah: number) => string;
	Runtime: (second: number) => string
	Ucapan: () => string;
	autoPath: (ext?: string)  => string
	createExif (Path: string, pakage?: string, author?: string): Promise <string>
	UserAgent (): string;
	RandomArray (array: any[]): any[]
}
export declare class ToolsMethod {
	Exec: (code: string) => Promise <string>;
	convertToWebp: (input: string) => Promise <string>;
	createWmSticker: (input: string, exif?: string) => Promise <string>;
	WebpToGif: (input: string) => Promise <string>
	WebpToMp4: (input: string) => Promise <string>
	Triggered: (input: string, output: string) => Promise <string>;
	convertWebpNoCrop: (input: string) => Promise <string>
	CreateImageToCircle: (input: string) => Promise <string>;
}
export declare class Formatter {
	LogLogin: () => void;
	getBuffer: (url: string) => Promise<Buffer>;
	getUrl: (Link: string) =>  RegExpMatchArray | null;
	Tunggu: (ms: number) => Promise <unknown>;
	RandomName: (jumlah: number) => string;
	Exec: (code: string) => Promise <string>
	Runtime: (second: number) => string
	Ucapan: () => string;
	autoPath: (ext?: string)  => string
	createExif (Path: string, pakage?: string, author?: string): Promise <string>;
	convertToWebp: (input: string) => Promise <string>;
	createWmSticker: (input: string, exif?: string) => Promise <string>;
	WebpToGif: (input: string) => Promise <string>
	WebpToMp4: (input: string) => Promise <string>
	UserAgent (os?: "Windows" | "Linux" | "Android" | "Macintosh" | "iPhone" | "Mac OS" | "default"): string;
	RandomArray (array: any[]): any[];
	Triggered: (input: string, output: string) => Promise <string>;
	convertWebpNoCrop: (input: string) => Promise <string>;
	CreateImageToCircle: (input: string) => Promise <string>;
}
