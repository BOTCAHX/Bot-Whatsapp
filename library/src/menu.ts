import { HandlingData,  EventEmitter, IRegister } from '../typings';
import { proto, MessageType } from "@adiwajshing/baileys";
import { ClientMessage } from '../Base/Scripts/client';
import Speed from 'performance-now';
import * as fs from "fs";
import { config } from "dotenv";
config({ path: "./.env"})

let Path: string = "./library/database/register.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify([]))

export var Menu: void = globalThis.Client.on("menu", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, prefix, isOwner, Jam, sender } = data;
	let Format: { withPrefix: { tag: string, menu: string[]}[],  noPrefix: { tag: string, menu: string[]}[]} = {
		withPrefix: [],
		noPrefix: []
	}
	const LajuCepat: number = Speed()
	const Ping: string = (Speed() - LajuCepat).toFixed(4);
	const database: IRegister[] = JSON.parse(fs.readFileSync(Path).toString()) as IRegister[];
	let headers: string = `👋🏻 Halo ${isOwner ? 'My Owner 🤴🏻' : 'ka'} ${Cli.respon.Ucapan()}


*🤴🏻 Bot :* ${process.env.nama_bot}
*⏰ Jam* : ${Jam}
*⏳ Runtime* : ${Cli.respon.Runtime(process.uptime())}
*🍃 Speed* : ${Ping}
*🪀 Creator* : @33753045534 ( *Ra* )
*🌄 Lib* : Baileys
*♦️ Hit User* : ${(database.find((value) => value.id == sender)?.hit || 1)}
*📜 Language :* Typescript
*⚔️ Prefix :* ${prefix}
*🕵🏻‍♂️ Github :* rayyreall
*🌚 Instagram :* @rayyreall
*🔑 Apikey* : Ga Pake
${(process.env.server !== undefined) ? "*🗄 Server :* " + process.env.server : ""} 
*👾 SC :* https://github.com/rayyreall/Bot-Whatsapp\n\n`
	for (const key in globalThis.Client.events) {
		const getEvent:  EventEmitter = globalThis.Client.events[key] as  EventEmitter
		if (getEvent.isButton) continue;
		if (getEvent.skipMenu) continue;
		if (getEvent.withPrefix) {
			if (Format.withPrefix.find((value) => value.tag == getEvent.tag)) {
				Format.withPrefix[Format.withPrefix.findIndex((value) => value.tag == getEvent.tag)].menu.push(...getEvent.event)
			} else {
				Format.withPrefix.push({ tag: getEvent.tag, menu: getEvent.event})
			}
		} else {
			if (Format.noPrefix.find((value) => value.tag == getEvent.tag)) {
				Format.noPrefix[Format.noPrefix.findIndex((value) => value.tag == getEvent.tag)].menu.push(...getEvent.event)
			} else {
				Format.noPrefix.push({ tag: getEvent.tag, menu: getEvent.event})
			}
		}
	} 
	let hasil: { tag: string, menu: string[]}[] = []
	for (let respon of Format.withPrefix) {
		if (hasil.find((value) => value.tag == respon.tag)) {
			hasil[hasil.findIndex((values) => values.tag == respon.tag)].menu.push(...respon.menu.map((value) =>  "*" + prefix + value +  "*").sort())
		} else {
			hasil.push({ tag: respon.tag, menu: respon.menu.map((value) => "*" + prefix + value +  "*").sort()})
		}
	}
	for (let respon of Format.noPrefix) {
		if (hasil.find((value) => value.tag == respon.tag)) {
			hasil[hasil.findIndex((values) => values.tag == respon.tag)].menu.push(...respon.menu.map((value) => "*" + value +  "*").sort())
		} else {
			hasil.push({ tag: respon.tag, menu: respon.menu.map((value) => "*" + value +  "*").sort()})
		}
	}
	let Menu: string = ""
	for (let menu of hasil) {
		menu.menu = menu.menu.filter((res1, res2) => menu.menu.indexOf(res1) == res2)
		Menu += `\n\n            *MENU ${menu.tag.toUpperCase()}*\n\n`
		Menu += "*ℒ⃝🕊️ •* " + menu.menu.join("\n*ℒ⃝🕊️ •* ")
	}
	let informations: string = `\n\n__________________________________
*Notes :*
*- Jangan Pernah Menelpon Bot Dan Owner Jika Menelpon Akan di block Otomatis dan TIdak ada Kata Unblock ‼️*
*- Jika Menemukan Bug, Error, Saran Fitur Harap Segera Lapor Ke Owner*
*- Bot Ini masih dalam Tahap pengembangan baru bikin:v*
*- Prefix bisa di set sesuai keinginan sendiri*
*- Bot Ini Dilengkapi Anti Spam, anda bisa menggunakan command berikutnya setelah prosess sebelumnya berakhir*
	
*Group : Coming soon*
__________________________________
*🔖 || IG*
@rayyreall`
return void await Cli.sendButtonMenu (from, {
	contentText: headers + Menu + informations,
	footerText: '🔖 @Powered by Ra',
	buttons: [
		{
			buttonId: 'owner',
			buttonText: { displayText: '𝗢𝗪𝗡𝗘𝗥 / 𝗖𝗥𝗘𝗔𝗧𝗢𝗥' },
			type: 1
		},
		{
			buttonId: 'sc',
			buttonText: { displayText: '𝗦𝗖𝗥𝗜𝗣𝗧 𝗕𝗢𝗧' },
			type: 1
		},
		{
			buttonId: 'syarat',
			buttonText: { displayText: '𝗦𝗬𝗔𝗥𝗔𝗧 & 𝗞𝗘𝗧𝗘𝗡𝗧𝗨𝗔𝗡' },
			type: 1
		}
	],
	headerType: 4,
	imageMessage: await (await Cli.client.prepareMessageMedia(fs.readFileSync('./library/storage/polosan/thumb.png'), MessageType.image,{ thumbnail: await Cli.compressGambar(fs.readFileSync('./library/storage/polosan/thumb.png')).toString()})).imageMessage
} as proto.ButtonsMessage, { mentioned: ["33753045534@s.whatsapp.net", sender as string] })

}, { event: ["menu"], tag: "user", command: ["menu", "manu"]})

export var Owner: void = globalThis.Client.on("ownerButtons", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id } = data;
	await Cli.sendContactOwner(from, id)
	return void (await Cli.reply(from, "Itu kak nomer ownerku, jangan dispam ya", id))
}, { event: ["owner"], tag: "user", command: ["owner"], isButton: true, withPrefix: false})

export var Script: void = globalThis.Client.on("Sc Buttons", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id } = data;
	return void (await Cli.reply(from, "Ini scnya kak https://github.com/rayyreall/Bot-Whatsapp Cara penginstalan ada di readme ya", id))
}, { event: ["sc"], tag: "user", command: ["sc"], isButton: true, withPrefix: false})