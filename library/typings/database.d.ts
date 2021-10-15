export declare interface IRegister {
	id: string;
	status: boolean;
	hit: number;
	multi: boolean;
	prefix: string;
	simple: boolean;
}

export declare interface IStickerCmd {
	id: string;
	cmd: ICmdSticker[]
}
export declare interface ICmdSticker {
	id: string;
	command: string;
}

export declare interface IConfiguration {
	public: boolean;
	antipakistan: boolean;
}

export declare class IAwayFromKeyboard {
	id: string;
	from: string; 
	alasan: string; 
	time: number;
}

export declare interface Configurations {
	isWeb?: boolean;
	path?: string;
	public?: boolean;
	antipakistan?: boolean;
	cookies?: string;
	database?: string;
}