import { proto } from '@adiwajshing/baileys';


/**
 * [getClientVersion description]
 */
export interface getClientVersion {
	isBroken: boolean
	isBelowSoft: boolean,
	isBelowHard: boolean
	hardUpdateTime: number
	beta: any | null,
	currentVersion: `${number}.${number}.${number}`
}

export interface ButtonsMessage {
	text?: string;
	subtitle?: string;
	buttons: IButtons[];
	headerType?: number;
	media?: Buffer | string;
	isDocs?: boolean;
	isLocation?: boolean;
	locationMessage?: proto.LocationMessage
}

/**
 * [IButtons description]
 */
export interface IButtons {
	id?: string;
	Text: string;
	type?: number;
}