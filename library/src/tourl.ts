import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { proto } from "@adiwajshing/baileys";
import * as fs from "fs";


export var ToUrl = globalThis.Client.on("tourl", async(data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, createAPI } = data;
	var { Ugusee } = createAPI;
	let File: string = await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string
	return void await Ugusee(File).then((respon) => {
		if (fs.existsSync(File)) fs.unlinkSync(File);
		return void Cli.reply(from, `ㅤㅤ *「 TO LINK 」*\n\n*💌 Nama :* ${respon.name}\n*⚖ Ukuran :* ${respon.size}\n*✨ Url :* ${respon.url}`, id)
	}).catch(async (err) => (await Cli.Panic("*「❗」* Mohon maaf kak, Gagal Mengupload File media anda")) && await Cli.Panic("Error To Url : " + err))
}, { event: ["tourl <media>"], command: ["tourl", "tolink"], tag: "converter", isMedia: true})