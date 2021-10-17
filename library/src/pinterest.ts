import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import parsems, { Parsed } from "parse-ms";



export var Pinterest = globalThis.Client.on("Pinterest", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, createAPI, args } = data;
	var { Pinterest } = createAPI;
	const Time: number = Date.now()
	let count: number = 1;
	const Jumlah: number = isNaN(Number(args[0])) ? 5 : Number(args[0])
	if (!isNaN(Number(args[0]))) {
		args.shift()
	}
	if (Jumlah > 8) return Cli.reply(from,  `*「❗」* Mohon maaf kak, Limit yang kakak masukkan melebihi batas, Batas maksimum limit fitur Pinterest adalah 8`, id);
	if (!args[0]) return Cli.reply(from, `*「❗」* Mohon Maaf kak, harap masukkan querry untuk melakukan pencarian pinterest`, id);
	let API: string[] | null = null;
	try { 
		API = await Pinterest(args.join(" "))
	} catch (err) {
		console.log(err)
		API = null;
	} finally {
		if (!API) return Cli.reply(from, `*「❗」* Mohon Maaf kak, Gagal Mendapatkan data Pinterest`, id);
		if (!API[0]) return Cli.reply (from, `*「❗」* Mohon Maaf kak,Result pencarian anda kosong`, id);
		await Cli.wait();
		for (const result of API) {
			if ((count > Jumlah) || (Jumlah >= API.length)) {
				const Timer: Parsed = parsems(Date.now() - Time)
				await Cli.reply(from, `*✅* Berhasil mengirimkan data Pinterest dalam waktu ${Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"}`, id);
				break;
			} else {
				await Cli.sendFile(from, result, { quoted: id }).catch(() => {})
				count++
			}
		}
	}
}, { event: ["pinterest <querry>"], isQuerry: true, command: "pinterest", tag: "search" })

export var PinDown = globalThis.Client.on("Pinterest Down", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, createAPI, args } = data;
	var { PinterestDown, RegPinterestDown  } = createAPI;
	let getUrl: RegExpMatchArray | null = args.join(" ").match(RegPinterestDown)
	if (!getUrl) return Cli.reply(from, `*「❗」* Mohon Maaf kak, Harap Masukkan Link Pinterest downloader`, id);
	await Cli.wait()
	return void await PinterestDown(getUrl[0]).then(async (respon) => {
		if (!respon) return await Cli.reply(from, "*「❗」* Mohon Maaf kak, Bot tidak mendapatkan data pinterest dari link yang kakak masukkan", id)
		return void await Cli.sendFile(from, respon, { quoted: id });
	}).catch(async (err) => (await Cli.Panic("*「❗」* Mohon Maaf kak, Fitur Pinterest downloader saat ini sedang error bot otomatis menghubungi owner")) && (await Cli.sendPanic(err)))
}, { event: ["pinterestdown <url>"], command: ["pindown", "pinterestdownloader", "pinterestdown"], tag: "downloader", isUrl: true})