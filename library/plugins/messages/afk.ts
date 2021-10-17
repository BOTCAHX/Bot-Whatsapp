import { HandlingData, IAwayFromKeyboard } from '../../typings';
import { ClientMessage } from '../../Base/Scripts/client';
import * as fs from "fs";
import parsems, { Parsed } from 'parse-ms';


const NoSpamAfk: Set<string> = new Set();
const rejectSpam: Set<string> = new Set();
let Path: string = "./library/database/afk.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify([]));
const database: IAwayFromKeyboard[] = JSON.parse(fs.readFileSync(Path).toString()) as IAwayFromKeyboard[];

export var AfkHandler = globalThis.Client.on("afk", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, sender, pushname, groupMetadata } = data;
	if (database.filter((value) => value.id === sender).find((values) => values.from === from)) return void await Cli.reply(from, `*「❗」* Fitur AFK telah anda diaktifkan sebelumnya.`, id)
	const Format: IAwayFromKeyboard = {
		id: sender as string,
		from: from,
		alasan: args[0] ? args.join(' ') : 'Sakaratul Maut',
		time: Date.now()
	}
	database.push(Format)
	fs.writeFileSync(Path, JSON.stringify(database, null, 2))
	return void await Cli.sendTextWithMentions(from, `ㅤㅤ *「 AFK MODE 」*

*➸ Nama :* ${pushname}
*➸ Target :* @${sender?.split("@")[0]}
*➸ In :* ${(await groupMetadata()).groupMetadata?.subject}
*➸ Alasan :* ${args[0] ? args.join(' ') : 'Sakaratul Maut'}
	
*Fitur AFK berhasil diaktifkan !*`, id)
}, { event: ["afk <alasan>"], tag: "groups", command: ["afk"], isGroupMsg: true })


export var tagAfk = globalThis.Client.open("tag afk", async (data: HandlingData, Cli: ClientMessage) => {
	return new Promise (async (resolve, reject) => {
		const { mentioned,  from, id, sender, isBot } = data;
		if (isBot) return
		if (mentioned[0]) {
			for (let taggar of mentioned) {
				if (database.filter((value) => value.id === taggar).find((values) => values.from === from)) {
					if (!!rejectSpam.has(sender as string)) return
					if (!!NoSpamAfk.has(sender as string)) return await Cli.reply(from, `*「❗」* Warning anda terdeteksi melakukan spam kepada user yang afk`, id) && rejectSpam.add(sender as string)
					let getValues: IAwayFromKeyboard  | undefined = database.filter((value) => value.id === taggar).find((values) => values.from === from)
					if (getValues?.id === sender) return
					const Time: Parsed = parsems(Date.now() - Number(getValues?.time))
					await Cli.sendTextWithMentions(from, `*「❗」* Jangan tag dia dia sedang afk dengan alasan ${getValues?.alasan},\n\nTelah afk selama ${Time.hours} Jam ${Time.minutes} menit ${Time.seconds} detik yang lalu`, id)
					NoSpamAfk.add(sender as string)
					resolve("Tag Afk")
					setTimeout(() => {
						if (!!NoSpamAfk.has(sender as string)) NoSpamAfk.delete(sender as string);
						if (!!rejectSpam.has(sender as string)) rejectSpam.delete(sender as string);
					}, 40000)
				}
			}
		}
	})
}, { isGroupMsg: true })

export var AfkCheck = globalThis.Client.open("check Afk", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, sender, command, prefix } = data;
	if (database.filter((value) => value.id === sender).find((values) => values.from === from)) {
		if (!command.startsWith(prefix + "afk")) {
			let getValues: IAwayFromKeyboard  | undefined = database.filter((value) => value.id === sender).find((values) => values.from === from)
			const Time: Parsed = parsems(Date.now() - Number(getValues?.time))
			database.splice(database.findIndex((value) => (value.id === sender && value.from === from)), 1)
			fs.writeFileSync(Path, JSON.stringify(database, null, 2))
			await Cli.reply(from, `Anda telah berhenti Afk, setelah afk selama  ${Time.hours} Jam ${Time.minutes} menit ${Time.seconds} detik yang lalu`, id)
			return "STOP AFK";
		}
	} 
}, { isGroupMsg: true })