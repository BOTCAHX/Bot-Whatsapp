import { WAMessage, proto, WAConnection} from '@adiwajshing/baileys';
import filesize from "filesize";
import { Validator, FileInformation, IRegister  } from "../../typings";



export class Validations {
	public Validations (chats: WAMessage): Validator {
		const message: proto.IFutureProofMessage = chats?.message?.ephemeralMessage || chats;
		const from: string = chats.key.remoteJid as string;
		const isGroupMsg: boolean = from.endsWith("@g.us");
		const type: string = Object.keys(message.message || ".")[0];
		const quotedType: string[] | null = message.message?.extendedTextMessage?.contextInfo?.quotedMessage ? Object.keys(message.message.extendedTextMessage.contextInfo.quotedMessage) : null;
		const typeQuoted: string = type == 'extendedTextMessage' && message?.message?.extendedTextMessage ? Object.keys(message.message.extendedTextMessage.contextInfo ? message.message.extendedTextMessage.contextInfo.quotedMessage ? message.message.extendedTextMessage.contextInfo.quotedMessage : { mentionedText: 'RA BOT' } : { thumbnailMessage: 'I`am Ra' })[0] : type;
		const quotedMsg: proto.IContextInfo | null | undefined = message.message?.extendedTextMessage?.contextInfo || message.message?.imageMessage?.contextInfo || message.message?.videoMessage?.contextInfo || message.message?.audioMessage?.contextInfo || message.message?.orderMessage?.contextInfo || message.message?.buttonsMessage?.contextInfo || message.message?.buttonsResponseMessage?.contextInfo ||
		message.message?.listMessage?.contextInfo || message.message?.liveLocationMessage?.contextInfo || message.message?.locationMessage?.contextInfo || message.message?.stickerMessage?.contextInfo || message.message?.templateMessage?.contextInfo || message.message?.productMessage?.contextInfo || message.message?.contactMessage?.contextInfo || message.message?.documentMessage?.contextInfo ||
		message.message?.orderMessage?.contextInfo;
		const quotedBody: string | null | undefined = typeQuoted === "conversation" ? quotedMsg?.quotedMessage?.conversation : typeQuoted === "imageMessage" ? quotedMsg?.quotedMessage?.imageMessage?.caption : typeQuoted === "videoMessage" ? quotedMsg?.quotedMessage?.videoMessage?.caption : typeQuoted === "buttonsMessage" ? quotedMsg?.quotedMessage?.buttonsMessage?.text : typeQuoted === "buttonsResponseMessage" ? quotedMsg?.quotedMessage?.buttonsResponseMessage?.selectedDisplayText :
		typeQuoted === "listMessage" ? quotedMsg?.quotedMessage?.listMessage?.title : typeQuoted === "templateMessage" ? quotedMsg?.quotedMessage?.templateMessage?.hydratedTemplate?.hydratedContentText : null;
		const body: string = message.message?.conversation || message.message?.extendedTextMessage?.text || message.message?.imageMessage?.caption || message.message?.videoMessage?.caption || message.message?.viewOnceMessage?.message?.imageMessage?.caption || message.message?.viewOnceMessage?.message?.videoMessage?.caption || message.message?.templateMessage?.hydratedTemplate?.hydratedTitleText || message.message?.buttonsResponseMessage?.selectedDisplayText || message.message?.listResponseMessage?.title || " ";
		let [command, ...args] =  body.split(" ")
		args = args || []
		command = command.toLowerCase()
		const getIdButton: string | null = message.message?.buttonsResponseMessage?.selectedButtonId || null
		let media: WAMessage | null = message?.message?.imageMessage || message?.message?.videoMessage || message?.message?.documentMessage || message?.message?.stickerMessage ? message
		: message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage ? JSON.parse(JSON.stringify(message).replace('quotedM', 'm')).message?.extendedTextMessage?.contextInfo
                : message?.message?.viewOnceMessage ? message.message.viewOnceMessage  : quotedMsg ? quotedMsg.quotedMessage?.viewOnceMessage ? {  stanzaId: quotedMsg.stanzaId, ...quotedMsg.quotedMessage?.viewOnceMessage } : quotedMsg.quotedMessage?.buttonsMessage ?  quotedMsg.quotedMessage.buttonsMessage.imageMessage ? { stanzaId: quotedMsg.stanzaId, message: { imageMessage: quotedMsg.quotedMessage.buttonsMessage.imageMessage }} : quotedMsg.quotedMessage.buttonsMessage.videoMessage ? { stanzaId: quotedMsg.stanzaId, message: { videoMessage:  quotedMsg.quotedMessage.buttonsMessage.videoMessage }} :  quotedMsg.quotedMessage.buttonsMessage.documentMessage ? { stanzaId: quotedMsg.stanzaId, message: { documentMessage:  quotedMsg.quotedMessage.buttonsMessage.documentMessage }} : null : null : message?.message?.buttonsMessage ? message.message.buttonsMessage.imageMessage ? { participant: chats?.participant, message: { imageMessage: message.message.buttonsMessage.imageMessage}} :  message.message.buttonsMessage.videoMessage ? { participant: chats?.participant, message: { videoMessage: message.message.buttonsMessage.videoMessage}}
		: message.message.buttonsMessage.documentMessage ? { participant: chats?.participant, message: { documentMessage: message.message.buttonsMessage.videoMessage}} : null : null;
		const mentioned: string[] | undefined[] = message.message?.extendedTextMessage?.contextInfo?.mentionedJid && message.message.extendedTextMessage.contextInfo.mentionedJid.length > 0 ? message.message.extendedTextMessage.contextInfo.mentionedJid : message?.message?.extendedTextMessage?.contextInfo?.quotedMessage && message.message.extendedTextMessage.contextInfo.participant ? [message.message.extendedTextMessage.contextInfo.participant] : [];
                const FileSha: string | null | undefined = message.message?.imageMessage ? Buffer.from(message.message.imageMessage.fileSha256 as Uint8Array).toString("base64") : message?.message?.videoMessage ? Buffer.from(message.message.videoMessage.fileSha256 as Uint8Array).toString("base64") : message?.message?.stickerMessage ? Buffer.from(message.message.stickerMessage.fileSha256 as Uint8Array).toString("base64") : quotedMsg ? quotedMsg.quotedMessage?.imageMessage ? Buffer.from(quotedMsg.quotedMessage.imageMessage.fileSha256 as Uint8Array).toString("base64") : quotedMsg.quotedMessage?.videoMessage ? Buffer.from(quotedMsg.quotedMessage.videoMessage.fileSha256 as Uint8Array).toString("base64") : quotedMsg.quotedMessage?.stickerMessage ? Buffer.from(quotedMsg.quotedMessage.stickerMessage.fileSha256 as Uint8Array).toString("base64") : null : null
                const Filesize: number  | undefined | null | any= media ? media.message ? media.message.audioMessage ? media.message.audioMessage.fileLength : media.message.imageMessage ? media.message.imageMessage.fileLength : media.message.videoMessage ? media.message.videoMessage.fileLength : media.message.documentMessage ? media.message.documentMessage.fileLength : 0 : null : null;
		const getBatas = (): FileInformation => {
			const Format: FileInformation = {
				durasi: null,
				fileSize: { 
					Length: null,
					size: null
				},
				type: null
			}
			if (typeQuoted === "audioMessage" || typeQuoted === "videoMessage" || typeQuoted === "stickerMessage") {
				let quoted: proto.IMessage | proto.AudioMessage | proto.VideoMessage | proto.StickerMessage | null | undefined = quotedMsg ? quotedMsg?.quotedMessage as proto.IMessage : message?.message as proto.IMessage
				if (!quoted) return Format
				quoted = quoted[typeQuoted] as proto.AudioMessage || proto.VideoMessage || proto.StickerMessage
				Format.durasi = quoted.seconds ?? null
				Format.fileSize.Length = Number(quoted.fileLength)
				Format.type = typeQuoted
				if (Format.fileSize.Length) Format.fileSize.size = filesize(Number(Format.fileSize.Length))
			}
			return Format
		}
		return { message, from, isGroupMsg, type, quotedType, typeQuoted, quotedMsg, bodyQuoted: quotedBody, body, command, media, mentioned,  FileSha, Filesize, fileInfo: getBatas, chats: chats, getIdButton, args }
	}
}
