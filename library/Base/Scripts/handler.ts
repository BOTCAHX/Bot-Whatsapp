import { Validations  } from ".";
import { WAChatUpdate,  WAContact, WAGroupMetadata, WAConnection, WAMessage, WAGroupParticipant, proto } from '@adiwajshing/baileys';
import moment from "moment-timezone";
import { getBuffer } from "../../functions/function"
import * as fs from "fs";
import { GroupMetadata, HandlingData, IRegister, Configurations } from "../../typings";
import CreateApi from "../../routers/api/index";


let Path: string = "./library/database/register.json";
if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify([]))

export class HandlerData  {
	public getRespon (chats: WAChatUpdate, client: WAConnection, config?: Configurations): HandlingData | undefined {
		if (config?.path && !fs.existsSync(config.database + "register.json"))  fs.writeFileSync(config.database + "register.json", JSON.stringify([]))
		if (!chats.hasNewMessage) return;
		const mess: WAMessage | undefined = chats.messages?.all()[0];
		if (mess?.key && mess.key.remoteJid === 'status@broadcast') return;
		const validation: Validations = new Validations()
		const { message, from, isGroupMsg, type, typeQuoted,  quotedMsg, media, command } = validation.Validations(mess as WAMessage);
		const database: IRegister[] = JSON.parse(fs.readFileSync(config?.database ? String(config?.database + "register.json") : Path).toString()) as IRegister[];
		const sender: string | null | undefined =  mess?.key.fromMe ? client.user.jid : isGroupMsg ? mess?.participant : mess?.key.remoteJid
		const contacts: string | WAContact | any = mess?.key.fromMe ? client.user.jid : client.contacts[sender || ''] || { notify: sender?.replace(/@.+/, '') }
		const content: string = JSON.stringify(message.message);
		const pushname: string = mess?.key.fromMe ? client.user.name : contacts?.notify || contacts.vname || contacts.name || 'Tidak Terdeteksi'
		const fromMe: boolean | undefined | null = mess?.key.fromMe ?? false;
		const isBot: boolean | undefined = mess?.key ? mess.key.id?.startsWith('3EB0') ? true : mess.key.id?.startsWith("RABOT") : false;
		const botNumber: string = client.user.jid;
		let OwnerWeb: string = config?.database ? JSON.parse(fs.readFileSync(String(`./library/routers/account/database/${config?.cookies}.json`)).toString()).nomer : "";
		const ownerNumber: string[] = [String(process.env.ownerNumber), botNumber, OwnerWeb];
		const sendOwner: string = ownerNumber[0];
		const isOwner: boolean = ownerNumber.includes(sender as string);
		const isMedia: boolean = type === 'imageMessage' || type === 'videoMessage';
		const isGambar: boolean = type === 'imageMessage';
		const isVideo: boolean = type === 'videoMessage';
		const isAudio: boolean = type === 'audioMessage';
		const isSticker: boolean = type === 'stickerMessage';
		const Jam: string = moment(new Date()).format('LLLL');
		const isQuotedSticker: boolean = typeQuoted === 'stickerMessage';
                const isQuotedImage: boolean = typeQuoted ===  'imageMessage';
                const isQuotedVideo: boolean = typeQuoted === "videoMessage";
                const isQuotedAudio: boolean = typeQuoted === 'audioMessage';
                const isQuotedDokumen: boolean = typeQuoted === 'documentMessage';
		const isQuotedStickerGif: boolean = media?.message?.stickerMessage?.isAnimated || false;
		const register: IRegister | undefined = database.find((value: IRegister | undefined) => value?.id == sender);
		const prefix: string = register?.multi ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(command) ? (command.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi) as RegExpMatchArray)[0] : "Multi Prefix" : register?.prefix ?? "."
		const id: proto.WebMessageInfo = mess as proto.WebMessageInfo;
		const superOwner: boolean = (config?.database == undefined && isOwner);
		const isPrefix: boolean = command.startsWith(prefix);
		const groupMetadata = async (): Promise <GroupMetadata> => {
			const groupMetadata: WAGroupMetadata | null = isGroupMsg ? await client.groupMetadata(from) : null;
			const bot: WAGroupParticipant | {} | undefined = isGroupMsg ? groupMetadata?.participants.find((v) => v.jid === client.user.jid) : {};
                        const user: WAGroupParticipant | {} | undefined = isGroupMsg ? groupMetadata?.participants.find((v) => v.jid === client.user.jid) : {};
			const groupMember: WAGroupParticipant[] | null | undefined = isGroupMsg ? groupMetadata?.participants : null;
                        const groupAdmins: string[] = isGroupMsg ? groupMember !== null ? groupMember?.filter((value) => value.isAdmin == true) ? groupMember.filter((value) => value.isAdmin == true).map((value) => value.jid) : [] : [] : [];
                        const isGroupAdmins: boolean = isGroupMsg ? groupAdmins.includes(sender || '') : false;
                        const isBotAdmins: boolean = isGroupMsg ? groupAdmins.includes(botNumber) : false;
                        const ownerGroup: string | null | undefined = isGroupMsg ? groupMetadata?.owner : null;
			return { groupMetadata, bot, user,  groupMember, groupAdmins, isGroupAdmins, isBotAdmins, ownerGroup } as GroupMetadata
		}
		const ToBuffer = async (getData?: string | Buffer): Promise <Buffer> => {
			if (media) {
				let getMedia: Buffer = await client.downloadMediaMessage(media)
				return getMedia
			} else if (typeof getData === "string" && fs.existsSync(String(getData))) {
				let getMedia: Buffer = fs.readFileSync(getData);
				return getMedia
			} else if (Buffer.isBuffer(getData)) {
				return getData
			} else if (typeof getData === "string" && getData.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))) {
				let getUrl: RegExpMatchArray = getData.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) as  RegExpMatchArray;
				return await getBuffer(getUrl[0])
			} else {
				return Buffer.alloc(5)
			}
		}
		const getQuotedMsg = async (id?: string): Promise <proto.WebMessageInfo> => {
			let respon: proto.WebMessageInfo = await client.loadMessage(from as string, id ?? quotedMsg?.stanzaId as string)
			return respon
		}
		const createAPI: CreateApi = new CreateApi()
		return { ...validation.Validations(mess as WAMessage), sender,contacts, content,  pushname, fromMe, isBot, botNumber,  ownerNumber, sendOwner, isOwner, isMedia, isGambar,  isVideo, isAudio, isSticker, Jam, isQuotedSticker, isQuotedImage,  isQuotedVideo, isQuotedAudio,  isQuotedDokumen, groupMetadata, ToBuffer,  getQuotedMsg, id, isQuotedStickerGif, createAPI,  prefix, isPrefix, config: config, superOwner } as HandlingData
	}
}
