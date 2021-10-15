import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { proto } from "@adiwajshing/baileys";
import * as fs from "fs";

export var Circle: void = globalThis.Client.on("Sticker Cirle", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, isGambar, isQuotedImage, command, createAPI } = data;
	if (isGambar || isQuotedImage) {
			const Sticker: Buffer = await createAPI.OpenWaSticker(await Cli.decryptMedia(media as proto.WebMessageInfo), { pack: "RA BOT", circle: true, keepScale: false });
			await Cli.sendFile(from, Sticker, { quoted: id })
	} else {
		return void Cli.reply(from, `*「❗」* Mohon maaf ka, diharapkan kirim/reply Gambar image dengan caption ${command} untuk menggunakan perintah ini`, id)
	}
 }, { event: ["stickercircle <image>"], tag: "manipulasi", command: ["stickerc", "stikerc", "stickercircle", "stikercircle", "scircle"], isMedia: true })