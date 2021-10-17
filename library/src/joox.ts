import { HandlingData, EventEmitter } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import got  from "got";



export var SearchJoox = globalThis.Client.on("joox search", async (data: HandlingData, Cli: ClientMessage, event: EventEmitter) => {
	const  { from, args, id, sendOwner } = data;
	var { JooxSearch } = data.createAPI;
	return void await JooxSearch(args.join(" ")).then((value) => {
		if (!value) return Cli.reply(from, "*「❗」* Mohon maaf kak pencarian joox tidak ditemukan", id);
		let text: string = "*「 𝐉𝐎𝐎𝐗 𝐒𝐄𝐀𝐑𝐂𝐇 」*\n\n"
		for (let result of value) {
			text += `*❒─────────────────❒*\n*⚔️ Id :* ${result.id}\n*🌀 Judul :* ${result.name}\n*💍 Artis :* ${result.artist_list[0].name}\n*💽 Album :* ${result.album_name}\n*⏱️ Durasi :* ${result.play_duration}\n*📍 Link :* https://www.joox.com/id/single/${result.id}\n`
		}
		return void Cli.sendFile(from, value[0].images[0].url, { quoted: id, caption: text })
	}).catch((err) => {
		Cli.sendText(sendOwner, "Error Fitur " + event.className + " : " + err)
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Joox Search sedang error bot akan segera menghubungi owner", id)
	})
}, { event: ["jooxsearch <judul>"], command: ["jooxsearch", "searchjoox"], tag: "musik", isJudul: true, loading: true })

export var JooxPlay = globalThis.Client.on("Joox Play", async (data: HandlingData, Cli: ClientMessage, event: EventEmitter) => {
	const { from, id, createAPI, args, sendOwner } = data;
	var {  JooxPlay, JooxSearch } = createAPI;
	if (/^(play)(?:s|)$/i.test(args[0])) {
		if (!args[1]) return void Cli.reply(from, "*「❗」* Mohon maaf kak harap masukkan judul untuk menggunakan fitur joox play", id)
		args.shift()
		let q: string = args.join(" ")
		return void await  JooxPlay(q).then(async (value) => {
			if (!value) return void await Cli.reply(from, "*「❗」* Mohon maaf kak pencarian joox tidak ditemukan", id);
			let Text: string =  `                *「 JOOX PLAY 」*

*❒────❒ 𝐈𝐍𝐅𝐎 ❒──────❒*
						
*⚔️ Id :* ${value.id}
*🌀 Judul :* ${value.title}
*💍 Artis :* ${value.artist}
*📧 Rilis :* ${value.publikasi}
*⏱️ Durasi :* ${value.durasi}
*♨️ Negara :* ${value.language}
*🗃️ Kualitas :* ${value.quality}
						
*❒────❒ 𝐑𝐚 𝐁𝐎𝐓 ❒────❒*`
			await Cli.sendFile(from, value.thumbnail.url as string, { quoted: id, caption: Text })
			let getBuffer: Buffer = await got({
				url: value.down.r192,
				headers: {
					"User-Agent": Cli.respon.UserAgent(),
					cookie: "wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;"
				}
			}).buffer()
			return void await Cli.sendAudio(from, getBuffer, { quoted: id })
		}).catch((err) => {
			Cli.sendText(sendOwner, "Error Fitur " + event.className + " : " + err)
			return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Joox Search sedang error bot akan segera menghubungi owner", id)
		})
	} else if (/^(search)$/i.test(args[0])) {
		if (!args[1]) return void Cli.reply(from, "*「❗」* Mohon maaf kak harap masukkan judul untuk menggunakan fitur joox search", id)
		args.shift()
		let q: string = args.join(" ")
		return void await JooxSearch(q).then((value) => {
			if (!value) return Cli.reply(from, "*「❗」* Mohon maaf kak pencarian joox tidak ditemukan", id);
			let text: string = "*「 𝐉𝐎𝐎𝐗 𝐒𝐄𝐀𝐑𝐂𝐇 」*\n\n"
			for (let result of value) {
				text += `*❒─────────────────❒*\n*⚔️ Id :* ${result.id}\n*🌀 Judul :* ${result.name}\n*💍 Artis :* ${result.artist_list[0].name}\n*💽 Album :* ${result.album_name}\n*⏱️ Durasi :* ${result.play_duration}\n*📍 Link :* https://www.joox.com/id/single/${result.id}\n`
			}
			return void Cli.sendFile(from, value[0].images[0].url, { quoted: id, caption: text })
		}).catch((err) => {
			Cli.sendText(sendOwner, "Error Fitur " + event.className + " : " + err)
			return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Joox Search sedang error bot akan segera menghubungi owner", id)
		})
	} else {
		return void await  JooxPlay(args.join(" ")).then(async (value) => {
			if (!value) return void await Cli.reply(from, "*「❗」* Mohon maaf kak pencarian joox tidak ditemukan", id);
			let Text: string =  `                *「 JOOX PLAY 」*

*❒────❒ 𝐈𝐍𝐅𝐎 ❒──────❒*
						
*⚔️ Id :* ${value.id}
*🌀 Judul :* ${value.title}
*💍 Artis :* ${value.artist}
*📧 Rilis :* ${value.publikasi}
*⏱️ Durasi :* ${value.durasi}
*♨️ Negara :* ${value.language}
*🗃️ Kualitas :* ${value.quality[192]}
						
*❒────❒ 𝐑𝐚 𝐁𝐎𝐓 ❒────❒*`
			await Cli.sendFile(from, value.thumbnail.url as string, { quoted: id, caption: Text })
			let getBuffer: Buffer = await got({
				url: value.down.r192,
				headers: {
					"User-Agent": Cli.respon.UserAgent(),
					cookie: "wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;"
				}
			}).buffer()
			return void await Cli.sendAudio(from, getBuffer, { quoted: id })
		}).catch((err) => {
			Cli.sendText(sendOwner, "Error Fitur " + event.className + " : " + err)
			return void Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur Joox Search sedang error bot akan segera menghubungi owner", id)
		})
	}
}, { event: ["joox <judul>"], command: "joox", tag: "musik", isQuerry: true })