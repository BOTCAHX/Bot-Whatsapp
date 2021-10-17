import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { WAChat } from "@adiwajshing/baileys";

export var broadcast = globalThis.Client.on("broadcast", async (data: HandlingData, Cli: ClientMessage) => {
	const  { from, id, media, args, bodyQuoted } = data;
	let getValues: string[] = Cli.client.chats.all().map((value) => value.jid);
	for (let value of getValues) {
		await setTimeout(async () => {
			if (media) {
				let getMedia: Buffer = await Cli.decryptMedia(media) as Buffer;
				await Cli.sendFile(value, getMedia, { caption:  `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`});
			} else {
				await Cli.sendTextWithMentions(value, `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`)
			}
		}, 12000)
	}
	await Cli.reply(from, "*✅* Berhasil melakukan broadcast", id)
}, { event: ["bc <media/text>"], tag: "owner", command: ["bc", "broadcast"]})


export var bcgc = globalThis.Client.on("broadcast-group", async (data: HandlingData, Cli: ClientMessage) => {
	const  { from, id, media, args, bodyQuoted } = data;
	let getValues: string[] = Cli.client.chats.all().filter((values: WAChat) => values.jid.endsWith("@g.us")).map((values) => values.jid) ;
	for (let value of getValues) {
		await setTimeout(async () => {
			if (media) {
				let getMedia: Buffer = await Cli.decryptMedia(media) as Buffer;
				await Cli.sendFile(value, getMedia, { caption:  `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`});
			} else {
				await Cli.sendTextWithMentions(value, `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`)
			}
		}, 12000)
	}
	await Cli.reply(from, "*✅* Berhasil melakukan broadcast", id)
}, { event: ["bcgc <media/text>"], tag: "owner", command: ["bcgc", "broadcastgroup"]})

export var bcpc = globalThis.Client.on("broadcast-personal", async (data: HandlingData, Cli: ClientMessage) => {
	const  { from, id, media, args, bodyQuoted } = data;
	let getValues: string[] = Cli.client.chats.all().filter((values: WAChat) => values.jid.endsWith("@s.whatsapp.net")).map((values) => values.jid);
	for (let value of getValues) {
		setTimeout(async () => {
			if (media) {
				let getMedia: Buffer = await Cli.decryptMedia(media) as Buffer;
				await Cli.sendFile(value, getMedia, { caption:  `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`});
			} else {
				await Cli.sendTextWithMentions(value, `ㅤㅤㅤㅤ  *「 BROADCAST 」*\n\n${args[0] ? args.join(" ") : bodyQuoted || ""}`)
			}
		}, 12000)
	}
	await Cli.reply(from, "*✅* Berhasil melakukan broadcast", id)
}, { event: ["bcpc <media/text>"], tag: "owner", command: ["bcpc", "broadcastpersonal"]})