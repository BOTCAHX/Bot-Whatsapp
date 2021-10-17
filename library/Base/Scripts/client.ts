import { WAConnection, MessageType, proto, WAGroupParticipant, compressImage, WAGroupModification, GroupSettingChange } from '@adiwajshing/baileys'
import {  HandlingData,  Formatter, ButtonsMessage  } from "../../typings";
import filetype, { FileTypeResult } from "file-type";
import { RandomName, getUrl, getBuffer } from "../../functions/function";
import { response } from "../../plugins";
import * as fs from "fs";
import { Headers } from "got";
import util from "util";

export class ClientMessage {
	constructor (public client: WAConnection, public data: HandlingData) {}
	public async sendText(from: string, text: string): Promise <proto.WebMessageInfo>  {
		return await this.client.sendMessage(from, text, MessageType.text)
	}
	public async reply (from: string, text: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		return await this.client.sendMessage(from, text, MessageType.text, { quoted: id })
	}
	public async decryptMedia (media: proto.WebMessageInfo, save?: boolean, path?: string): Promise <Buffer | string> {
		const result: string[] = []
		const angka: string = '0123456789'
		let Total: number = angka.length
		for (let i: number = 0; i < 2; i++) {
			result.push(angka.charAt(Math.floor(Math.random() * Total)))
		}
		if (save) return await this.client.downloadAndSaveMediaMessage(media, path || `./library/storage/temp/${RandomName(Number(result.join("")))}`)
		return await this.client.downloadMediaMessage(media)
	}
	public async sendButtons (from: string, buttons: ButtonsMessage, id?: proto.WebMessageInfo) {
		const ParseMentioned: string[] | undefined = (String(buttons.text).match(/@(0|[0-9]{4,16})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) ?? []
		const Reparse: string[] | undefined = (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) ?? []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		let metadata;
		let thumb: { thumbnail?: Buffer | undefined } | any = { thumbnail: undefined };
		let Mime;
		if (!buttons.text) buttons.text = "";
		if (!buttons.subtitle) buttons.subtitle = "";
		for (let button of buttons.buttons) {
			if (!button.id) button.id = "1";
			if (!button.type) button.type = 1;
		}
		if (!buttons.headerType && !buttons.media) {
			buttons.headerType = 1;
		} else if (!buttons.headerType && buttons.media) {
			let MediaBuffer: Buffer = Buffer.isBuffer(buttons.media) ? buttons.media : fs.existsSync(buttons.media) ? fs.readFileSync(buttons.media) : await getBuffer((getUrl(buttons.media) as RegExpMatchArray)[0])
			const getType: FileTypeResult | undefined = Buffer.isBuffer(buttons.media) ? (await filetype.fromBuffer(buttons.media)) : fs.existsSync(buttons.media) ? (await filetype.fromFile(buttons.media)) : (await filetype.fromBuffer(await getBuffer((getUrl(buttons.media) as RegExpMatchArray)[0])));
			switch (buttons.isLocation ? "location" : buttons.isDocs ? "docs": getType?.ext) {
				case "docs": {
					buttons.headerType = 3;
					Mime = getType?.mime
					metadata = { documentMessage: { ...(await this.client.prepareMessageMedia(MediaBuffer, MessageType.document, { mimetype: getType?.mime})).documentMessage, mimetype: getType?.mime }}
				}
				break
				case "location": {
					buttons.headerType = 6;
					metadata = { locationMessage: buttons.locationMessage}
				}
				break
				case "mp4":
				case "mkv":
				case "m4a":
				case "m4p":
				case "m4v":
				case "gif":
				     buttons.headerType = 5;
					 metadata = { videoMessage: (await this.client.prepareMessageMedia(MediaBuffer, MessageType.video)).videoMessage }
				break
				case "png":
				case "jpg":
				case "webp":
				    buttons.headerType = 4;
					let img: proto.Message = await this.client.prepareMessageMedia(MediaBuffer, MessageType.image, { thumbnail: compressImage(MediaBuffer) as any, })
					metadata = { imageMessage: img.imageMessage }
					thumb.thumbnail = await compressImage(MediaBuffer)
				break
			}
		}
		if (!metadata) metadata = {}
		let createNewButtons: proto. IButton[] = []
		for (let Button of buttons.buttons) {
			createNewButtons.push({
				buttonId: Button.id,
				buttonText: { displayText: Button.Text},
				type: Button.type
			})
		}
		const createParams:  proto.ButtonsMessage = {
			contentText: buttons.text,
			footerText: buttons.subtitle,
			buttons:  createNewButtons,
			headerType: buttons.headerType,
			...metadata
		} as proto.ButtonsMessage;
		if (!thumb.thumbnail) thumb = {}
		return await this.client.sendMessage(from, createParams as proto.ButtonsMessage, MessageType.buttonsMessage, { ...thumb, quoted: id, contextInfo: { mentionedJid: Mentioned }, mimetype: Mime})
	}
	public respon: Formatter = response as Formatter
	public async sendTextWithMentions (from: string, text: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		const ParseMentioned: string[] | undefined = (String(text).match(/@(0|[0-9]{4,16})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) ?? []
		const Reparse: string[] | undefined = (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) ?? []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		return await this.client.sendMessage(from, text, MessageType.extendedText, { quoted: id, contextInfo: { mentionedJid: Mentioned }, waitForAck: true })
	}
	public async sendButtonMenu (from: string, buttons: proto.ButtonsMessage, settings?: { quoted?: proto.WebMessageInfo, mentioned?: string[]}) {
		let response: proto.WebMessageInfo | any = await this.client.prepareMessage(from, buttons, MessageType.buttonsMessage, { thumbnail: await compressImage(fs.readFileSync('./library/storage/polosan/thumb.png')).toString(), quoted: settings?.quoted, contextInfo: { mentionedJid: settings?.mentioned}})
		const Thumb: Buffer = await compressImage(fs.readFileSync('./library/storage/polosan/thumb.png'))
		if (response.message?.ephemeralMessage) {
			response.message.ephemeralMessage.message.buttonsMessage.imageMessage.jpegThumbnail = Thumb
		} else {
			response.message.buttonsMessage.imageMessage.jpegThumbnail = Thumb
		}
		return void (await this.client.relayWAMessage(response))
	}
	public async sendContactOwner (from: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		const Vcard: string =
		'BEGIN:VCARD\n' +
		'VERSION:3.0\n' +
		'FN: I`am Ra\n' +
		'ORG: RA BOT\n' +
		'TEL;type=CELL;type=VOICE;waid=33753045534:+33 7 53 04 55 34\n' +
		'END:VCARD'
		const Contact: proto.ContactMessage  = { displayName: 'I`am Ra', vcard: Vcard } as proto.ContactMessage
		return await this.client.sendMessage(from, Contact, MessageType.contact, { quoted: id})
	}
	public compressGambar: (bufferFileOrPath: string | Buffer) => Promise <Buffer> = compressImage

	public async wait (): Promise <proto.WebMessageInfo> {
		return await this.reply(this.data.from, `*⌛* Mohon tunggu sebentar bot sedang melaksanakan perintah`, this.data.id)
	}
	
	public async Print (text: string): Promise <proto.WebMessageInfo> {
		return await this.reply(this.data.from, JSON.stringify(text, null, 4), this.data.id)
	}
	public Type = MessageType;
	public async sendVideo (from: string, media: Buffer | string, _settings?: { caption?: string, quoted?: proto.WebMessageInfo, viewOnce?: boolean, withMentions?: boolean, constumHeaders?: Headers }): Promise <proto.WebMessageInfo> {
		const ParseMentioned: string[] | undefined = _settings?.withMentions == true ? (String(_settings?.caption).match(/@(0|[0-9]{4,16})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) : []
		const Reparse: string[] | undefined = _settings?.withMentions == true ? (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) : []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		if (Buffer.isBuffer(media)) {
			return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned } })
		} else if (typeof media === "string" && fs.existsSync(media)) {
			media = fs.readFileSync(media);
			return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned } })
		} else if (typeof media === "string" && getUrl(media)) {
			let Url: RegExpMatchArray = getUrl(media) as RegExpMatchArray
			media = await getBuffer(Url[0], _settings?.constumHeaders);
			return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned } })
		} else {
			return this.reply(from, "Media Not Support")
		}
	}
	public async sendAudio (from: string, media: Buffer | string, _settings?: { caption?: string, quoted?: proto.WebMessageInfo, withMentions?: boolean, costumHeaders?: Headers }): Promise <proto.WebMessageInfo> {
		const ParseMentioned: string[] | undefined = _settings?.withMentions == true ? (String(_settings?.caption).match(/@(0|[0-9]{4,16})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) : []
		const Reparse: string[] | undefined = _settings?.withMentions == true ? (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) : []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		if (Buffer.isBuffer(media)) {
			return await this.client.sendMessage(from, media, MessageType.audio, { caption: _settings?.caption, quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned } })
		} else if (typeof media === "string" && fs.existsSync(media)) {
			media = fs.readFileSync(media);
			return await this.client.sendMessage(from, media, MessageType.audio, { caption: _settings?.caption, quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned } })
		} else if (typeof media === "string" && getUrl(media)) {
			let Url: RegExpMatchArray = getUrl(media) as RegExpMatchArray
			media = await getBuffer(Url[0], _settings?.costumHeaders);
			return await this.client.sendMessage(from, media, MessageType.audio, { caption: _settings?.caption, quoted: _settings?.quoted,  contextInfo: { mentionedJid: Mentioned } })
		} else {
			return this.reply(from, "Media Not Support")
		}
	}
	public  sendPanic = async (err: any): Promise <proto.WebMessageInfo> => {
		return await this.client.sendMessage(this.data.sendOwner, "Error Fitur " + this.data.command + " :\n\n" + util.format(err), MessageType.extendedText)
	}
	public Panic = async (err: any): Promise <proto.WebMessageInfo> => {
		return await this.client.sendMessage(this.data.from, util.format(err), MessageType.extendedText, { quoted: this.data.id })
	}
	public Add = async (respon: string | string[], target?: string | string[]): Promise <WAGroupModification> => {
		if (target) {
			return await this.client.groupAdd(respon as string, Array.isArray(target) ? target :  new Array(target.endsWith("@s.whatsapp.net") ? target : target + "@s.whatsapp.net"))
		} else {
			return await this.client.groupAdd(this.data.from, Array.isArray(respon) ? respon : new Array(respon.endsWith("@s.whatsapp.net") ? respon : respon + "@s.whatsapp.net"))
		}
	}
	public Kick = async  (respon: string | string[], target?: string | string[]): Promise <WAGroupModification> => {
		if (target) {
			return await this.client.groupRemove(respon as string, Array.isArray(target) ? target :  new Array(target.endsWith("@s.whatsapp.net") ? target : target + "@s.whatsapp.net"))
		} else {
			return await this.client.groupRemove(this.data.from, Array.isArray(respon) ? respon : new Array(respon.endsWith("@s.whatsapp.net") ? respon : respon + "@s.whatsapp.net"))
		}
	}
	public Promote = async  (respon: string | string[], target?: string | string[]): Promise <WAGroupModification> => {
		if (target) {
			return await this.client.groupMakeAdmin(respon as string, Array.isArray(target) ? target : new Array(target.endsWith("@s.whatsapp.net") ? target : target + "@s.whatsapp.net"))
		} else {
			return await this.client.groupMakeAdmin(this.data.from, Array.isArray(respon) ? respon :  new Array(respon.endsWith("@s.whatsapp.net") ? respon : respon + "@s.whatsapp.net"))
		}
	}
	public Demote =  async  (respon: string | string[], target?: string | string[]): Promise <WAGroupModification> => {
		if (target) {
			return await this.client.groupDemoteAdmin(respon as string, Array.isArray(target) ? target :  new Array(target.endsWith("@s.whatsapp.net") ? target : target + "@s.whatsapp.net"))
		} else {
			return await this.client.groupDemoteAdmin(this.data.from, Array.isArray(respon) ? respon : new Array(respon.endsWith("@s.whatsapp.net") ? respon : respon + "@s.whatsapp.net"))
		}
	}
	public setNameGroup = async (respon: string, title?: string): Promise <WAGroupModification> => {
		if (!this.data.isGroupMsg) return await this.Panic("Bukan dalam Group")
		if (title) {
			return await this.client.groupUpdateSubject(respon, title)
		} else {
			return await this.client.groupUpdateSubject(this.data.from, respon)
		}
	}
	public setDeskGroup = async (respon: string, desk?: string): Promise <WAGroupModification> => {
		if (!this.data.isGroupMsg) return await this.Panic("Bukan dalam Group")
		if (desk) {
			return await this.client.groupUpdateDescription(respon, desk)
		} else {
			return await this.client.groupUpdateDescription(this.data.from, respon)
		}
	}
	public group = async (respon: string | "open" | "close" | "buka" | "tutup", action?: "open" | "close" | "buka" | "tutup") => {
		if (action) {
			switch (action) {
				case "open":
				case "buka":
				return await this.client.groupSettingChange(respon as string, GroupSettingChange.messageSend, false);
				case "close":
				case "tutup":
				return await this.client.groupSettingChange(respon as string, GroupSettingChange.messageSend, true);
			}
		} else {
			switch (respon) {
				case "open":
				case "buka":
				return await this.client.groupSettingChange(this.data.from, GroupSettingChange.messageSend, false);
				case "close":
				case "tutup":
				return await this.client.groupSettingChange(this.data.from, GroupSettingChange.messageSend, true);
			}
		}
	}

	public async sendFile (from: string, media: Buffer | string | proto.WebMessageInfo, _settings?: { caption?: string, quoted?: proto.WebMessageInfo, ptt?: boolean, viewOnce?: boolean, withMentions?: boolean, forwardingScore?: number, filename?: string, sendDocs?: boolean, autoPreview?: proto.ExternalAdReplyInfo }): Promise <proto.WebMessageInfo | void> {
		const ParseMentioned: string[] | undefined = _settings?.withMentions == true ? (String(_settings?.caption).match(/@(0|[0-9]{4,16})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) : []
		const Reparse: string[] | undefined = _settings?.withMentions == true ? (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) : []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		try {
			if (Buffer.isBuffer(media)) {
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings?.sendDocs ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime, filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore, externalAdReply: _settings?.autoPreview }})
					case "gif":
					    let sendGif: proto.WebMessageInfo = await this.client.prepareMessage(from, media, MessageType.video,  { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false,contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore  } })
						if (sendGif.message?.videoMessage) {
							sendGif.message.videoMessage.gifPlayback = true;
						} else if (sendGif.message?.ephemeralMessage?.message?.videoMessage) {
							sendGif.message.ephemeralMessage.message.videoMessage.gifPlayback= true;
						}
					    return await this.client.relayWAMessage(sendGif)
					case "mp4":
					case "mkv":
					case "m4a":
					case "m4p":
					case "m4v":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore  } })	
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings?.quoted, ptt: _settings?.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore, externalAdReply: _settings?.autoPreview }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore, externalAdReply: _settings?.autoPreview }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }, thumbnail: (await (await this.compressGambar(media)) as any) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime || "application/x", filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})	
				}
			} else if (typeof media === "string" && fs.existsSync(media)) {
				media = fs.readFileSync(media)
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings?.sendDocs ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime || "application/x", filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})	
					case "gif":
					    let sendGif: proto.WebMessageInfo = await this.client.prepareMessage(from, media, MessageType.video,  { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false,contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore  } })
						if (sendGif.message?.videoMessage) {
							sendGif.message.videoMessage.gifPlayback = true;
						} else if (sendGif.message?.ephemeralMessage?.message?.videoMessage) {
							sendGif.message.ephemeralMessage.message.videoMessage.gifPlayback= true;
						}
					    return await this.client.relayWAMessage(sendGif)	
					case "mp4":
					case "mkv":
					case "m4a":
					case "m4p":
					case "m4v":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore } })
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings?.quoted, ptt: _settings?.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }, thumbnail: (await (await this.compressGambar(media)) as any) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime, filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})	
				}
			} else if (typeof media === "string" && getUrl(media)) {
				let Url: RegExpMatchArray = getUrl(media) as RegExpMatchArray;
				let link: string = Url[0];
				if (this.data.createAPI.RegPinterestDown.exec(Url[0])) {
					link = await this.data.createAPI.PinterestDown(Url[0]) as string;
				} else if (this.data.createAPI.RegexTiktok.exec(Url[0])) {
					try {
						link = (await this.data.createAPI.TtDownloader(Url[0]))?.nowm as string;
					} catch (err) {
						link = (await this.data.createAPI.Musiccaly(Url[0]))?.nowm as string;
					}
				} else if (this.data.createAPI.RegexJoox.exec(Url[0])) {
					link = (await this.data.createAPI.JooxDownloader(((this.data.createAPI.RegexJoox.exec(Url[0]) as RegExpExecArray)[2])).then((value) => value?.url)) as string
				}
				media = await getBuffer(link);
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings?.sendDocs == true ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime || "application/x", filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
					case "gif":
					    let sendGif: proto.WebMessageInfo = await this.client.prepareMessage(from, media, MessageType.video,  { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false,contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore  } })
						if (sendGif.message?.videoMessage) {
							sendGif.message.videoMessage.gifPlayback = true;
						} else if (sendGif.message?.ephemeralMessage?.message?.videoMessage) {
							sendGif.message.ephemeralMessage.message.videoMessage.gifPlayback= true;
						}
					    return await this.client.relayWAMessage(sendGif)
					case "mp4":
					case "mkv":
					case "m4a":
					case "m4p":
					case "m4v":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore } })
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings?.quoted, ptt: _settings?.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings?.caption, quoted: _settings?.quoted, viewOnce: _settings?.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }, thumbnail: (await (await this.compressGambar(media)) as any) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings?.quoted, mimetype: File?.mime, filename: _settings?.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})	
				}
			} else if (this.data.media == media) {
				let respon: proto.WebMessageInfo = await this.client.prepareMessageFromContent(from, media.message as proto.IMessage,  {  caption: _settings?.caption,quoted: _settings?.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings?.forwardingScore }})
				return await this.client.relayWAMessage(respon, { waitForAck: true})
			} else {
				throw new ErrorEvent("Harap Masukkan media file")
			}
		} catch (err) {
			throw new Error(String (err))
		}
	}
}
