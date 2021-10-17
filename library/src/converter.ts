import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { proto } from "@adiwajshing/baileys";

export var Tomp3 = globalThis.Client.on("tomp3", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media,isVideo, isQuotedVideo, command } = data;
	if (isVideo || isQuotedVideo) {
		await Cli.wait()
		let Input: string = await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string
		let Output: string = Cli.respon.autoPath("mp3")
		return void ffmpeg(Input)
		.noVideo()
		.format("mp3")
		.outputOptions('-ab', '192k')
		.on("error", () => {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			throw Cli.reply(from, "*「❗」* Mohon maaf kak, Bot gagal mengubah Video Menjadi audio", id)
		})
		.on("end", async () => {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			await Cli.sendFile(from, Output, { quoted: id })
			await Cli.respon.Tunggu(2000)
			if (fs.existsSync(Output)) fs.unlinkSync(Output)
		})
		.save(Output)
	} else {
		return void await Cli.reply(from, "*「❗」* Mohon maaf kak, untuk menggunakan fitur ini kamu harus reply audio dengan caption " + command + " untuk mengubah video menjadi audio", id)
	}
}, { event: ["tomp3 <video>"], tag: "converter", command: ["tomp3", "toaudio"], isMedia: true });

export var ToVideo = globalThis.Client.on("tovideo", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, isQuotedSticker, isQuotedStickerGif } = data;
	const { WebpToMP4 } = data.createAPI;
	if (!isQuotedSticker) return Cli.reply(from, `*「❗」* Mohon maaf kak, harap reply sticker Gif untuk mengubah Sticker gif menjadi video`, id)
	if (!isQuotedStickerGif) return Cli.reply(from, `*「❗」* Mohon maaf kak, harap reply sticker Gif untuk mengubah Sticker gif menjadi video`, id)
	await Cli.wait()
	const input: string = await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string;
	return void (await WebpToMP4(input).then(async (respon) => {
		if (fs.existsSync(input)) fs.unlinkSync(input)
		await Cli.sendFile(from, respon.data, { quoted: id})
	}).catch (() => {
		if (fs.existsSync(input)) fs.unlinkSync(input)
		Cli.reply(from, `*「❗」* Mohon maaf kak, Media yang kamu kirim tidak dapat bot akses harap ganti media anda`, id)
	}))
}, { event: ["tovid <stickergif>"], command: ["tovid", "tovideo"], tag: "converter", isMedia: true });