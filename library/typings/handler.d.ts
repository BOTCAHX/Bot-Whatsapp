import { proto, WAMessage,  WAGroupMetadata, WAGroupParticipant, WAContact } from "@adiwajshing/baileys";
import CreateApi from "../routers/api/index";
import { Configurations } from "./"

export declare class HandlingData extends Validator {
	contacts: string | WAContact | any;
	content: string;
	pushname: string;
	fromMe: boolean | undefined | null;
	isBot: boolean | undefined;
	botNumber: string;
	ownerNumber: string[];
	sendOwner: string;
	isOwner: boolean;
	isMedia: boolean;
	isGambar: boolean;
	isVideo: boolean;
	isAudio: boolean;
	isSticker: boolean;
	Jam: string;
	isQuotedSticker: boolean;
	isQuotedImage: boolean;
	isQuotedVideo: boolean;
	isQuotedAudio: boolean;
	sender: string | null | undefined;
	id: proto.WebMessageInfo
	isQuotedDokumen: boolean;
	getIdButton: string | null | undefined;
	groupMetadata: () => Promise <GroupMetadata>;
	ToBuffer: (getData?: string | Buffer) => Promise <Buffer>;
	getQuotedMsg: (id?: string) => Promise <proto.WebMessageInfo>;
	isQuotedStickerGif: boolean;
	createAPI: CreateApi;
	prefix: string;
	isPrefix: boolean;
	config: Configurations;
	superOwner: boolean;
}
export declare class Validator {
	message: proto.IFutureProofMessage;
	from: string;
	isGroupMsg: boolean;
	type: string;
	quotedType: string[] | null;
	typeQuoted: string;
	quotedMsg: proto.IContextInfo | null | undefined;
	bodyQuoted: string | null | undefined;
	media: WAMessage | null;
	body: string;
	args: string[]
	command: string;
	mentioned: string[] | undefined[];
	FileSha: string | null | undefined;
	Filesize: number  | undefined | null;
	getIdButton: string | null | undefined;
	fileInfo: () => FileInformation;
	chats: WAMessage;
}
export interface FileInformation { 
	durasi: number | null;
	fileSize: FileSizeData;
	type: string | null 
}
export interface FileSizeData {
	Length: number | null;
	size: null | string;
}
export declare interface GroupMetadata {
	groupMetadata: WAGroupMetadata | null;
	bot: WAGroupParticipant | {} | undefined;
	user: WAGroupParticipant | {} | undefined;
	groupMember: WAGroupParticipant[] | null | undefined;
	groupAdmins: string[];
	isGroupAdmins: boolean;
	isBotAdmins: boolean;
	ownerGroup: string | null | undefined
}
export declare interface getCommand {
	event: string[];
	tag: string;
	withPrefix?: boolean;
	command: string | string[];
	prefix?: string;
	isGroupMsg?: boolean;
	isOwner?: boolean;
	withImghelpers?: string | Buffer | proto.WebMessageInfo;
	isBotAdmins?: boolean;
	isAdmins?: boolean;
	limit?: {
		isLimit?: boolean;
		limit?:number
	};
	enable?: boolean;
	isQuerry?: boolean;
	isMedia?: boolean;
	helpers?: string | undefined;
	isBlockir?: boolean | undefined;
	isPrivate?: boolean | undefined;
	izin?: string[] | undefined;
	isPremium?: boolean | undefined;
	antispam?: boolean;
	isUrl?: boolean;
	delaySpam?: number;
	autoblock?: boolean;
	isButton?: boolean;
	loading?: boolean;
	skipMenu?: boolean;
	simple?: boolean;
	isUsername?: boolean;
	isJudul?: boolean;
	isQuerryWithReply?: boolean;
	isMentioned?: boolean;
	limitText?: number;
	superOwner?: boolean;
}
export declare class EventEmitter implements getCommand {
	className: string;
	callback: any;
	event: string[];
	tag: string;
	enable?: boolean
	withPrefix?: boolean | undefined;
	command: string | string[];
	prefix?: string | undefined;
	isGroupMsg?: boolean | undefined;
	isOwner?: boolean | undefined;
	helpers?: string | undefined;
	isBotAdmins?: boolean | undefined;
	isAdmins?: boolean | undefined;
	limit?: { isLimit?: boolean | undefined; limit?: number | undefined; } | undefined;
	isBlockir?: boolean | undefined;
	isPrivate?: boolean | undefined;
	izin?: string[] | undefined;
	isPremium?: boolean | undefined;
	antispam?: boolean;
	isUrl?: boolean;
	delaySpam?: number;
	autoblock?: boolean;
	isQuerry?: boolean;
	isMedia?: boolean;
	isButton?: boolean;
	loading?: boolean;
	skipMenu?: boolean;
	simple?: boolean;
	isUsername?: boolean;
	isJudul?: boolean;
	withImghelpers?: string | Buffer | proto.WebMessageInfo;
	isQuerryWithReply?: boolean;
	isMentioned?: boolean
	limitText?: number;
	superOwner?: boolean
}