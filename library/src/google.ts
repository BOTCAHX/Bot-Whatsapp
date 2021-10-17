import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import parsems, { Parsed } from "parse-ms";
import { languages } from "@vitalets/google-translate-api";



export var googleSearch = globalThis.Client.on("google search", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, createAPI } = data;
	var { GoogleSearch } = createAPI;
	return void await GoogleSearch(args.join(" ")).then((result) => {
		if (!result) return Cli.reply(from, "*「❗」*  Mohon maaf kak, pencarian google anda tidak di temukan bot", id);
		let Text: string = '*「 𝐆𝐎𝐎𝐆𝐋𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 」*\n\n'
		for (let handle of result) {
			Text += `*❒─────────────────❒*\n*📚 Judul :* ${handle.title}\n*🔸 Tanggal :* ${handle.tanggal}\n*💫 Link :* ${handle.url}\n*📖 Informasi :* ${handle.snippet}\n`
		}
		return void Cli.reply(from, Text, id)
	}).catch ((err) => {
		Cli.sendText(from, "Error fitur Google :" + err)
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Google saat ini sedang error bot otomatis  menghubungi owner bot", id)
	})
}, { event: ["google <querry>"], tag: "search", command: ["google", "googlesearch"], isQuerry: true })

export var googleImg = globalThis.Client.on("Google image", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, createAPI } = data;
	var { GoogleImages } = createAPI;
	let getNumber: number = isNaN(Number(args[0])) ? 7 : Number(args[0])
	const Time: number = Date.now()
	let count: number = 1;
	if (!isNaN(Number(args[0]))) args.shift();
	if (getNumber > 12) return Cli.reply(from, "*「❗」*  Mohon maaf kak, Pencarian maksimal Google Image adalah 12 default pencarian 7", id);
	if (!args[0]) return Cli.reply(from, "*「❗」* Mohon maaf kak, Harap masukkan pencarian untuk memasukkan querry", id);
	await Cli.wait()
	return void await GoogleImages(args.join(" ")).then(async (result) => {
		if (!result) return Cli.reply(from, "*「❗」*  Mohon maaf kak, pencarian google image anda tidak di temukan bot", id);
		for (let hasil of result) {
			if (count >= getNumber) {
				const Timer: Parsed = parsems(Date.now() - Time)
				await Cli.sendFile(from, hasil, { quoted: id, caption: `Success melakukan pencarian Google Image dalam waktu ${Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"}`}).catch(() => {})
				break
			} else {
				await Cli.sendFile(from, hasil).catch(() => {})
				count++
			}
		}
	}).catch ((err) => {
		Cli.sendText(from, "Error fitur Google Image:" + err)
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Google Image saat ini sedang error bot otomatis  menghubungi owner bot", id)
	})
}, { event: ["googleimg <querry>"], tag: "search", command: ["googleimg", "googleimage"], isQuerry: true})

export var Translate = globalThis.Client.on("Translate", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, createAPI, args, bodyQuoted, sendOwner } = data;
	var { GoogleTranslate, checkSupportLanguage } = createAPI;
	let Code: string | undefined;
	if (checkSupportLanguage(args[0])) {
		Code = args[0]
		args.shift()
		if (!args[0] && !bodyQuoted) return Cli.reply(from, "*「❗」* Mohon maaf kak, harap masukkan querry untuk melakukan translate", id)
	}
	return void await GoogleTranslate(bodyQuoted ? bodyQuoted : args.join(" "), Code).then((respon) => {
		if (!respon) return void Cli.reply(from, "*「❗」* Mohon maaf kak, bot tidak dapat melakukan translate anda harap coba lagi nanti", id)
		let Lang: languages | any = languages;
		return void Cli.reply(from, `*🌐 Negara deteksi :* ${Lang[respon.from.language.iso]}\n*📍 Translate :* ${respon.text}`, id)
	}).catch((err) => {
		Cli.sendText(sendOwner, "Error Translate :" + err)
		return Cli.reply(from, "*「❗」* Mohon maaf kak, fitur translate sedang error bot akan segera menghubungi owner", id)
	})
}, { event: ["translate <negara> <text>"], command: ["translate"], tag: "converter", isQuerry: true, isQuerryWithReply: true })