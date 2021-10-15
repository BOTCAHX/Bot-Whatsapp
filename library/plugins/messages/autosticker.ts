import { HandlingData } from '../../typings';
import { ClientMessage } from '../../Base/Scripts/client';
import { proto } from "@adiwajshing/baileys";
import * as fs from "fs";

export var AutoStickerPrivate: void = globalThis.Client.open("auto-sticker-private", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, isGambar, isVideo, isGroupMsg, media, id, isPrefix, createAPI } = data;
	if (isGambar && !isGroupMsg && !isPrefix) {
		try {
			const Sticker: Buffer = await createAPI.OpenWaSticker(await Cli.decryptMedia(media as proto.WebMessageInfo), { pack: "RA BOT"})
			await Cli.sendFile(from, Sticker, { quoted: id })
		} catch (err) {
			console.log(err)
			Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id)
		}
		return "Auto Sticker Image"
	} else if (isVideo && !isGroupMsg && !isPrefix) {
		let LocExif: string = "./library/storage/temp/Ra_default_Exif"
		if (!fs.existsSync(LocExif + ".exif")) await Cli.respon.createExif(LocExif, "RA BOT")
		await Cli.respon.convertToWebp(await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string).then(async (values: string) => {
			await Cli.sendFile(from, values, { quoted: id})
			await Cli.respon.Tunggu(2500)
			if (fs.existsSync(values)) fs.unlinkSync(values)
		}).catch ((err) => {
			if (fs.existsSync(LocExif + ".exif")) fs.unlinkSync(LocExif + ".exif")
			console.log(err)
			Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id)
		})
		return "Auto Sticker Video"
	}
})