import { HandlingData,  GroupMetadata } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { proto } from "@adiwajshing/baileys";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";

export var groupPromote = globalThis.Client.on("Group Promote", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, mentioned, groupMetadata } = data;
	if ((await groupMetadata()).groupMember?.filter((value) => value.isAdmin).map((values) => values.jid).find((value) => value === mentioned[0])) return void await Cli.reply(from, "*「❗」* Mohon maaf kak, member tersebut admin kamu tidak dapat menaikkan jabatan member tersebut", id)
	return void (await Cli.Promote(mentioned as string[]).then(() => Cli.sendTextWithMentions(from, `*✅* Berhasil menaikkan jabatan @${(mentioned as string[]).map((tag) => tag.replace('@s.whatsapp.net', '')).join(" , @")} menjadi admin`, id)))
}, { event: ["promote <mentioned>"], tag: "group admins", command: ["promote"], isGroupMsg: true, isAdmins: true, isBotAdmins: true, isMentioned: true })

export var groupDemote  = globalThis.Client.on("Group Demote", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, mentioned, groupMetadata } = data;
	const groupMeta: GroupMetadata = await groupMetadata()
	if (groupMeta.ownerGroup == mentioned[0]) return void await Cli.reply(from, "*「❗」*  Mohon maaf kak, kakak tidak dapat menurunka jabatan owner group", id)
	if (!groupMeta.groupAdmins.find((value) => value === mentioned[0])) return void await Cli.reply(from, "*「❗」* Mohon maaf kak, kamu hanya dapat menurunkan jabatan admin group saja", id)
	return void (await Cli.Demote(mentioned as string[]).then(() => Cli.sendTextWithMentions(from, `*✅* Berhasil menurunkan jabatan @${(mentioned as string[]).map((tag) => tag.replace('@s.whatsapp.net', '')).join(" , @")} menjadi member`, id)))
},  { event: ["demote <mentioned>"], tag: "group admins", command: ["demote"], isGroupMsg: true, isAdmins: true, isBotAdmins: true, isMentioned: true })

export var groupActions  = globalThis.Client.on("Group OC", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, args, id, groupMetadata } = data;
	let test: "buka" | "tutup" | null = /^(open|buka)$/i.test(args[0]) ? "buka" : /^(close|tutup)$/i.test(args[0]) ? "tutup" : null
	if (!test) return Cli.reply(from, "*「❗」*  Maaf kak format yang kakak masukkan salah, pilih buka/tutup", id)
	const metadata: GroupMetadata = await groupMetadata()
	let text: string = `*✅* Berhasil ${(test === "buka") ? "Membuka" : "Menutup"} group  ${metadata.groupMetadata?.subject}, Sekarang semua member ${(test === "buka") ? "dapat" : "tidak dapat"}  mengirimkan pesan`
	return void ((await Cli.group(from, test)) && await Cli.reply (from, text, id))
}, { event: ["group <open/close>"], tag: "group admins", command: ["group", "groups"],  isGroupMsg: true, isAdmins: true, isBotAdmins: true })

export var setNameGc  = globalThis.Client.on("setname group", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, groupMetadata } = data;
	return void await Cli.setNameGroup(args.join(" ")).then(async () => Cli.reply(from, `*✅*  Berhasil mengubah deskripsi group ${(await groupMetadata()).groupMetadata?.subject}`, id))
}, { event: ["setnamegc <nama>"], tag: "group admins", command: ["setnamegc", "setnamagroup", "setnamagc", "setnamegroup"], isGroupMsg: true, isAdmins: true, isBotAdmins: true, isQuerry: true, limitText: 27 })

export var setDeskGc  = globalThis.Client.on("setdesk group", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, groupMetadata } = data;
	return void await Cli.setDeskGroup(args.join(" ")).then(async () => Cli.reply(from, "*✅*  Berhasil mengubah deskripsi group " + (await groupMetadata()).groupMetadata?.subject, id))
}, { event: ["setdesc <deskripsi>"], tag: "group admins", command: ["setdesc", "setdesk"], isGroupMsg: true, isAdmins: true, isBotAdmins: true, isQuerry: true, limitText: 27 })

export var setProfileGroup  = globalThis.Client.on("setppgc", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, isGambar, isQuotedImage, isQuotedSticker } = data;
	if (isGambar && isQuotedImage) {
		return void await Cli.client.updateProfilePicture(from, (await Cli.decryptMedia(media as proto.WebMessageInfo) as Buffer)).then(() => Cli.reply(from, "*✅* Berhasil mengubah foto profil group", id)).catch(() => Cli.reply(from, "*「❗」*  Terjadi kesalahan saat ingin mengubah foto profil harap ganti media anda", id))
	} else if (isQuotedSticker) {
		let Input: string = await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string;
		let output: string = Cli.respon.autoPath("png")
		return void ffmpeg(Input)
		.on("error", () => {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			return void Cli.reply(from, "*「❗」*  Terjadi kesalahan saat ingin mengubah foto profil harap ganti media anda", id)
		})
		.on("end", async () => {
			if (fs.existsSync(Input)) fs.unlinkSync(Input)
			await Cli.client.updateProfilePicture(from, fs.readFileSync(output)).then(() => Cli.reply(from, "*✅* Berhasil mengubah foto profil group", id)).catch(() => Cli.reply(from, "*「❗」*  Terjadi kesalahan saat ingin mengubah foto profil harap ganti media anda", id))
			if (fs.existsSync(output)) fs.unlinkSync(output)
			return;
		})
		.saveToFile(output)
	} else {
		return void await Cli.reply(from, "*「❗」*  Mohon maaf kak, harap reply gambar/ sticker untuk mengganti foto profile group", id)
	}
}, { event: ["setppgc <image/sticker>"], tag: "group admins", command: ["setppgc", "setppgroup", "setppgrup"],  isGroupMsg: true, isAdmins: true, isBotAdmins: true, isMedia: true })