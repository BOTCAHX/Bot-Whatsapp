import { WAConnection } from "@adiwajshing/baileys";
import { getCommand, HandlingData, EventEmitter, IRegister, IStickerCmd, EventCommand, EventsEmit, Configurations } from "../../typings";
import chalk from "chalk";
import { ClientMessage  } from ".";
import HandleExports from "./handleExports";
import * as fs from "fs";
import { config } from 'dotenv';
config({ path: './.env' });

let Path: string = "./library/database/register.json";
let SaveStiCmd: string = "./library/database/sticmd.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify([]))
if (!fs.existsSync(SaveStiCmd)) fs.writeFileSync(SaveStiCmd, JSON.stringify([]))

const Events: any = {};
const Detections: any = {}
const antispam: Set<String> = new Set();
const waitSpam: Set<String> = new Set();
const rejectSpam: Set<String> = new Set();
const doubleSpam: Set<String> = new Set();

export class CommandHandler {
	public events: any = Events;
	public detector: any = Detections;
	public client: WAConnection | undefined;
	public res: ClientMessage  | undefined;
	constructor(public config: Configurations) {
    }
	public async on (className: string, callback: (data: HandlingData, res: ClientMessage, event: EventEmitter) => void, _event: getCommand) {
		_event.withPrefix = _event.withPrefix ?? true
		_event.enable = _event.enable ? _event.enable : true
		let getExports =  await new HandleExports().getHandle()
		for (let result in getExports) {
			if (!this.events[className] && !this.events[result])  {
				this.events[className] = {
					nameClass: className,
					callback,
					..._event
				}
			}
			if (!this.events[className] && !this.events[result])  {
				this.events[result] = {
					nameClass: result,
					...getExports[result]
				}
			}
			this.events[result] = {
				...getExports[result]
			}
			this.events[className] = {
				...this.events[className],
				callback,
				..._event
			}
		}
	}
	public open (className: string, callback: (data: HandlingData, res: ClientMessage, event: EventsEmit ) => any, _event: EventCommand = {}) {
		_event.enable = _event.enable ? _event.enable : true;
		_event.isBot = _event.isBot ? _event.isBot : true;
		if (!this.detector[className]) this.detector[className] = {
			target: className,
			callback,
			..._event
		}
		this.detector[className] = {
			...this.detector[className],
			callback,
			..._event
		}
	}
	public getEventsDetector (client: WAConnection, data: HandlingData, res: ClientMessage) {
		return new Promise (async (resolve, reject) => {
			this.client = client;
			this.res = res;
			let { isOwner, isGroupMsg, groupMetadata, fromMe, Jam, sender, args, pushname, isBot } = data;
			try {
				Object.keys(this.detector).map(async (className) => {
					const event: EventsEmit = this.detector[className];
					if (!event.enable && !isOwner) return;
					if (event.isGroupMsg && !isGroupMsg) return;
					if (event.isGroupAdmins && (await groupMetadata()).isGroupAdmins) return;
					if (event.isBot && isBot) return;
					let hasil: string | undefined;
					try {
						hasil = (await event.callback(data, res, event)) 
					} catch (err) {
						console.log(err)
					} finally {
						if (hasil) console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.keyword('blue')(`[\x1b[1;32m${chalk.hex('#009940').bold('RECORD')}]`), chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'),chalk.cyan('\x1bmSTATUS :\x1b'), chalk.hex('#fffb00')(fromMe ? 'SELF' : 'PUBLIK'), chalk.greenBright('[COMMAND]'), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.blueBright(hasil), chalk.hex('#f7ef07')(`[${args?.length}]`),chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'), chalk.hex('#26d126')('[PENGIRIM]'),chalk.hex('#f505c1')(pushname), chalk.hex('#ffffff')(`(${sender?.replace(/@s.whatsapp.net/i, '')})`), chalk.greenBright('IN'), chalk.hex('#0428c9')(`${(await groupMetadata()).groupMetadata?.subject}`), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.hex('#f2ff03')('[DATE] =>'),chalk.greenBright(Jam.split(' GMT')[0]))
					}
				})
			} catch (err) {
				return void console.log(err)
			} 
		})
	}
	public waitEventsUpdate (client: WAConnection, data: HandlingData, res: ClientMessage) {
		return new Promise (async (resolve, reject) => {
			this.client = client
			this.res = res;
			let { isOwner, prefix,  command, isGroupMsg, from, id,  groupMetadata, Jam, fromMe, args, pushname, sender, media, getIdButton, bodyQuoted, isSticker, FileSha, mentioned, superOwner } = data;
			if (this.config.database && !fs.existsSync(this.config.database + "register.json")) fs.writeFileSync(this.config.database + "register.json", JSON.stringify([]))
			if (this.config.database && !fs.existsSync(this.config.database + "sticmd.json")) fs.writeFileSync(this.config.database + "sticmd.json", JSON.stringify([]))
			const database: IRegister[] = JSON.parse(fs.readFileSync(this.config.database ? this.config.database + "register.json" : Path).toString()) as IRegister[];
			if (!database.find((value) => value.id == sender)) {
				database.push({ id: sender as string, status: false, hit: 1, multi: true, prefix: ".", simple: false})
				fs.writeFileSync(this.config.database ? this.config.database + "register.json" : Path, JSON.stringify(database, null, 2))
			}
			try {
				for (const className in this.events) {
					const event: EventEmitter = this.events[className];
					if (!event.enable && !isOwner) continue;
					if (isSticker) {
						const _database: IStickerCmd[] = JSON.parse(fs.readFileSync(this.config.database ? this.config.database + "sticmd.json" : SaveStiCmd).toString()) as IStickerCmd[];
						if (_database.find((value) => value.id == sender)) command =  _database.find((value) => value.id == sender)?.cmd.find((values) => values.id === FileSha)?.command || ""
						command = prefix + command;
					}
					const getPrefix: string = this.checkPrefix(prefix, event);
					let PrefixKhusus: boolean = command.startsWith(prefix);
					let _command: string = event.isButton ? getIdButton ?? "" : command.startsWith(getPrefix) ? command.replace(getPrefix, "") : command
					const isCmd: boolean = this.getCmd(event.isButton ? getIdButton ?? "" : command, event.command, getPrefix)
					if (!isCmd) continue
					event.simple = (event.simple == undefined) ? false : event.simple;
					event.antispam = (event.antispam == undefined) ? true : event.antispam;
					event.isBlockir = (event.isBlockir == undefined) ? true : event.isBlockir;
					if (database.find((value) => value.id == sender)) {
						database[database.findIndex((value: IRegister) => value.id == sender)].hit++
						fs.writeFileSync(Path, JSON.stringify(database, null, 2))
					}
					if (event.isOwner && !isOwner) return;
					if (event.superOwner && !superOwner) return;
					if (event.isBlockir && this.client.blocklist.find((values: string) => values === sender?.replace("@c.us", "@s.whatsapp.net"))) return;
					if (event.antispam && !isOwner && !!doubleSpam.has(sender as string)) return;
					if (event.antispam && !isOwner && !!rejectSpam.has(sender as string)) return;
					if (event.antispam && !isOwner && !!waitSpam.has(sender as string)) return rejectSpam.add(sender as string) && await this.res.reply(from, `*「❗」* Mohon maaf kak, Tunggu perintah sebelumnya berakhir terlebih dahulu jika kakak ingin menggunakan perintah berikutnya`, id)
					if (event.antispam && !isOwner && !!antispam.has(sender as string)) return doubleSpam.add(sender as string) && await this.res.reply(from, `*「❗」* Maaf ka setelah anda menggunakan command ada jeda ${String(event.delaySpam).split("000")[0] ?? 7} detik untuk anda bisa menggunakan command kembali`, id)
					if (event.withImghelpers && event.helpers && /^(?:-|--)help(?:s|)$/i.test(args[0])) return await this.res.sendFile(from, event.withImghelpers, { caption: event.helpers, quoted: id })
					if (event.helpers && /^(?:-|--)help(?:s|)$/.test(args[0])) return this.res.reply(from,event.helpers, id)
					if (event.isQuerry && event.isQuerryWithReply && !args[0] && !bodyQuoted) return  this.res.reply(from, "*「❗」* Mohon maaf kak, harap kirim pesan dengan querry atau kakak juga bisa reply pesan menggunakan caption untuk menggunakan perintah tersebut", id)
					if (event.limitText && args[0] && Number(args.join(" ").length) >= Number(event.limitText)) return this.res.reply(from, `*「❗」* Mohon maaf kak, max kata untuk perintah ${command} adalah ${event.limitText}`, id)
					if (event.isMentioned && !mentioned[0]) return this.res.reply(from, "*「❗」* Mohon maaf kak, harap tag seseorang untuk melakukan perintah ini", id)
					if (event.isJudul && !args[0]) return  this.res.reply(from, "*「❗」* Mohon maaf kak, harap masukkan masukkan judul untuk menggunakan perintah ini", id)
					if (event.isQuerry && !args[0]) return this.res.reply(from, "*「❗」* Mohon maaf kak, harap masukkan querry untuk menggunakan perintah tersebut", id)
					if (event.isUsername && !args[0]) return this.res.reply(from, "*「❗」*  Mohon maaf kak, Harap masukkan Username " + event.className + " untuk menjalankan perintah ini", id);
					if (event.isMedia && !media) return this.res.reply(from, "*「❗」*  Mohon maaf kak, harap masukkan media jika kamu ingin menggunakan perintah tersebut", id)
					if (event.isUrl && !res.respon.getUrl(args.join(" "))) return this.res.reply(from, "*「❗」* Mohon maaf kak, untuk menggunakan perintah ini kakak harus memasukkan url agar bot dapat mengeksekusi perintah tersebut", id)
					if (event.isPrivate && !isOwner && isGroupMsg) return this.res.reply(from, "*「❗」* Mohon maaf kak, Perintah ini hanya dapat di gunakan di personal chat saja kak", id)
					if (event.isGroupMsg && !isGroupMsg && !isOwner) return await res.reply(from, "*「❗」* Maaf kak perintah ini hanya bisa di gunakan di dalam grup saja kak", id)
					if (event.isAdmins && !isOwner && !(await groupMetadata()).isGroupAdmins) return await this.res.reply(from, "*「❗」*  Mohon Maaf kak, Perintah ini dapat digunakan khusus untuk admin group saja", id)
					if (event.isBotAdmins && !isOwner && !(await groupMetadata()).isBotAdmins) return await this.res.reply(from, "*「❗」* Mohon Maaf Kak, Perintah ini dapat di gunakan jika bot menjadi admin group", id)
					try {
						if (event.antispam && !isOwner) waitSpam.add(sender as string);
						if (event.loading && !event.simple) await this.res.reply(from, `*⌛* Mohon tunggu sebentar bot sedang melaksanakan perintah`, id)
						return void  (await event.callback(data, res, event)) 
					} catch (err) {
						if (event.antispam && !!rejectSpam.has(sender as string)) rejectSpam.delete(sender as string)
						if (event.antispam && !!waitSpam.has(sender as string)) waitSpam.delete(sender as string)
						if (event.antispam && !!antispam.has(sender as string)) antispam.delete(sender as string)
						if (event.antispam && !!doubleSpam.has(sender as string)) doubleSpam.delete(sender as string)
						if (/not expecting a response/gi.test(String(err))) return;
						console.log(err)
						this.res.reply(from, "*「❗」* Mohon Maaf kak, Saat ini Fitur sedang Error Bot otomatis menghubungi owner", id)
						throw this.res.sendText(data.sendOwner, "Error " + _command + ":" + err)
					} finally {
						if (event.antispam && !isOwner && !!waitSpam.has(sender as string)) waitSpam.delete(sender as string);
						if (event.antispam && !isOwner && !!rejectSpam.has(sender as string)) rejectSpam.delete(sender as string)
						if (event.antispam && !isOwner) antispam.add(sender as string)
						console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.keyword('blue')(`[\x1b[1;32m${chalk.hex('#009940').bold('RECORD')}]`), chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'),chalk.cyan('\x1bmSTATUS :\x1b'), chalk.hex('#fffb00')(fromMe ? 'SELF' : 'PUBLIK'), chalk.greenBright('[COMMAND]'), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.blueBright(command), chalk.hex('#f7ef07')(`[${args?.length}]`),chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'), chalk.hex('#26d126')('[PENGIRIM]'),chalk.hex('#f505c1')(pushname), chalk.hex('#ffffff')(`(${sender?.replace(/@s.whatsapp.net/i, '')})`), chalk.greenBright('IN'), chalk.hex('#0428c9')(`${(await groupMetadata()).groupMetadata?.subject}`), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.hex('#f2ff03')('[DATE] =>'),chalk.greenBright(Jam.split(' GMT')[0]))
						return void (setTimeout( () => {
							if (event.antispam && !!antispam.has(sender as string)) antispam.delete(sender as string)
							if (event.antispam && !!doubleSpam.has(sender as string)) doubleSpam.delete(sender as string)
						}, event.delaySpam ?? 7000))
					}
				}
			} catch (err) {
				throw reject(console.log(err))
			}
		})
	}
	private getCmd (command: string, cmd: string | string[], prefix: string) {
		const isCmd: boolean = Array.isArray(cmd) ? cmd.some((value: string) => (prefix + value == command)) : typeof cmd == "string" ? prefix + cmd === command : false
		return isCmd
	}
	private checkPrefix (prefix: string, events: EventEmitter): string {
		if (events.withPrefix && events.prefix) {
			return events.prefix
		} else if (events.withPrefix) {
			return prefix
		} else {
			return ""
		}
	}
}
