import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { proto } from "@adiwajshing/baileys";

export var Sticker: void = globalThis.Client.on("sticker", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, args, isGambar, isQuotedImage, isVideo, isQuotedVideo, isQuotedSticker, createAPI } = data;
	if (isGambar || isQuotedImage) 
		try {
			await Cli.reply(from, `*⌛* Mohon tunggu sebentar bot sedang melaksanakan perintah`, id)
			const Sticker: Buffer = await createAPI.OpenWaSticker(await Cli.decryptMedia(media as proto.WebMessageInfo), { pack:  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[0] : args.join(" "), author:  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[1] : undefined})
			return void await Cli.sendFile(from, Sticker, { quoted: id})
		} catch (err) {
			return void Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id)
		}
	else if (isVideo || isQuotedVideo)
	    try {
			await Cli.reply(from, `*⌛* Mohon tunggu sebentar bot sedang melaksanakan perintah`, id)
			let LocExif: string = args[0] ? Cli.respon.autoPath() : "./library/storage/temp/Ra_default_Exif"
			if (!fs.existsSync(LocExif + ".exif")) await Cli.respon.createExif(LocExif, /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[0] : args.join(" ") , /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[1] : undefined)
			await Cli.respon.convertToWebp(await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string).then(async (values: string) => {
				await Cli.sendFile(from, values, { quoted: id})
				await Cli.respon.Tunggu(2500)
				if (fs.existsSync(LocExif + ".exif")) fs.unlinkSync(LocExif + ".exif")
				if (fs.existsSync(values)) fs.unlinkSync(values)
			}).catch ((err) => {
				if (fs.existsSync(LocExif + ".exif")) fs.unlinkSync(LocExif + ".exif")
				console.log(err)
				return void Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id)
			})
	
		} catch (err) {
			throw new Error(String(err))
		}
	else if (isQuotedSticker)
	    try {
			await Cli.reply(from, `*⌛* Mohon tunggu sebentar bot sedang melaksanakan perintah`, id)
			let LocExif: string = args[0] ? Cli.respon.autoPath() : "./library/storage/temp/Ra_default_Exif"
			if (!fs.existsSync(LocExif + ".exif")) await Cli.respon.createExif(LocExif, /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[0] : args.join(" ") , /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[1] : undefined)
			return void await Cli.respon.createWmSticker(await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string, LocExif + ".exif").then(async (values: string) => {
				await Cli.sendFile(from, values, { quoted: id })
				await Cli.respon.Tunggu(2500)
				if (args[0] && fs.existsSync(LocExif + ".exif")) fs.unlinkSync(LocExif + ".exif")
				if (fs.existsSync(values)) fs.unlinkSync(values)
			}).catch(() => {
				if (args[0] && fs.existsSync(LocExif + ".exif")) fs.unlinkSync(LocExif + ".exif")
			})
		} catch (err) {
			throw new Error(String(err))
		}
	else	
	   return void Cli.reply(from, "*「❗」*  Maaf kak Harap Kirim/Reply Gambar/Video yang ingin di ubah menjadi sticker", id)
	
}, { event: ["sticker <media>"], tag: "converter", command: ["s", "sticker", "stiker", "stickergif", "stikergif", "sgif"], isMedia: true, loading: false, withImghelpers: "https://bit.ly/39026d3", helpers: globalThis.Lang.HelpSticker() })

export var sticker2: void = globalThis.Client.on("Sticker2", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, args, isGambar, isQuotedImage, isVideo, isQuotedVideo, isQuotedSticker, createAPI } = data;
	var { OpenWaSticker } = createAPI;
	let getWm1: string | undefined =  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[0] : undefined;
	let getWm2: string | undefined =  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[1] : undefined;
	if (isGambar || isQuotedImage || isVideo || isQuotedVideo) {
		await Cli.wait()
		return void await OpenWaSticker((await Cli.decryptMedia(media as proto.WebMessageInfo)), { author: getWm2, pack: getWm1, keepScale: true }).then(async (value) => {
			return void await Cli.sendFile(from, value, { quoted: id });
		}).catch(() =>  Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id))
	} else {
		return void await Cli.reply(from, "*「❗」*  Maaf kak Harap Kirim/Reply Gambar/Video yang ingin di ubah menjadi sticker", id)
	}
}, { event: ["sticker2 <media>"], tag: "converter", command: ["s2", "sticker2", "stiker2", "stickergif2", "stikergif2", "sgif2"], isMedia: true })

export var Stickernocrop: void = globalThis.Client.on("sticker no crop", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, args, isGambar, isQuotedImage, isVideo, isQuotedVideo, isQuotedSticker, createAPI } = data;
	var { OpenWaSticker } = createAPI;
	let getWm1: string | undefined =  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[0] : undefined;
	let getWm2: string | undefined =  /\|/gi.test(args.join(" ")) ? args.join(" ").split("|")[1] : undefined;
	if (isGambar || isQuotedImage || isVideo || isQuotedVideo) {
		await Cli.wait()
		return void await OpenWaSticker((await Cli.decryptMedia(media as proto.WebMessageInfo)), { author: getWm2, pack: getWm1, keepScale: false }).then(async (value) => {
			return void await Cli.sendFile(from, value, { quoted: id });
		}).catch(() =>  Cli.reply(from, "*「❗」* Gagal membuat sticker harap coba lagi lain waktu", id))
	} else {
		return void await Cli.reply(from, "*「❗」*  Maaf kak Harap Kirim/Reply Gambar/Video yang ingin di ubah menjadi sticker", id)
	}
}, { event: ["stickernocrop <media>"], tag: "converter", command: ["stickernocrop", "stikernocrop","snocrop"], isMedia: true})

export var Triggereder: void = globalThis.Client.on("triggered", async function (data: HandlingData, Cli: ClientMessage) {
	const { from, id, media, isGambar, isQuotedImage, isQuotedSticker, isQuotedStickerGif } = data;
	if (isGambar || isQuotedImage) {
		await Cli.wait()
		var { Triggered, autoPath, convertWebpNoCrop, Tunggu } = Cli.respon;
		let createGif: string = await Triggered(await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string, autoPath("gif"));
		return void await convertWebpNoCrop(createGif).then(async (values: string) => {
			await Cli.sendFile(from, values, { quoted: id })
			if (fs.existsSync(createGif)) fs.unlinkSync(createGif)
			await Tunggu(2000)
			if (fs.existsSync(values)) fs.unlinkSync(values)
			return;
		}).catch (() => {
			if (fs.existsSync(createGif)) fs.unlinkSync(createGif)
			return void Cli.reply(from, "*「❗」* Mohon maaf kak bot gagal membuat Sticker", id)
		})
	} else if (isQuotedSticker) {
		if (isQuotedStickerGif) return Cli.reply(from, "*「❗」* Mohon maaf kak Fitur ini tidak support untuk sticker gif", id)
		let Input: string = await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string;
		let Output: string =  Cli.respon.autoPath("png")
		return void ffmpeg(Input)
		.on('error', function () {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			if (fs.existsSync(Output)) fs.unlinkSync(Output)
			return Cli.reply(from, "*「❗」* Mohon maaf kak Fitur Bot gagal membuat Sticker Trigger", id)
		})
		.on("end", async function () {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			let createGif: string = await Triggered(Output, autoPath("gif"));
			return void await convertWebpNoCrop(createGif).then(async (values: string) => {
				await Cli.sendFile(from, values, { quoted: id })
				if (fs.existsSync(createGif)) fs.unlinkSync(createGif)
				if (fs.existsSync(Output)) fs.unlinkSync(Output)
				await Tunggu(2000)
				if (fs.existsSync(values)) fs.unlinkSync(values)
				return;
			}).catch (() => {
				if (fs.existsSync(createGif)) fs.unlinkSync(createGif)
				if (fs.existsSync(Output)) fs.unlinkSync(Output)
				return void Cli.reply(from, "*「❗」* Mohon maaf kak bot gagal membuat Sticker", id)
			})
		})
		.saveToFile(Output)
	} else {
		return void Cli.reply(from, "*「❗」* Mohon Maaf kak kirim / reply Gambar untuk membuat sticker trigger", id)
	}
}, { event: ["triggered <image|sticker>"], command: ["strigger", "trigger", "triggered", "stickertriggered", "stikertriggered"], tag: "converter", isMedia: true })