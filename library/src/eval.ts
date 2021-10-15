import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { Public,  SettingsPublic } from "../Base/Scripts/main"
import util from "util";
import * as ts from "typescript";


export var Eval: void = globalThis.Client.on("eval", async (data: HandlingData, Cli: ClientMessage) => {
	const { args, from, id } = data;
	const convert: string = ts.transpile(`(async () => { 
		${args?.join(' ')}
	})()`)
	try {
		const send: string = util.format(eval(convert))
		return void await Cli.reply(from, util.format(send), id)
	} catch (err) {
		throw Cli.reply(from, util.format(err), id)
	}
}, { event: ["=> <Kode Jawascript>"], command: "=>", tag: 'owner', withPrefix: false, isOwner: true, antispam: false  })

export var Execute: void = globalThis.Client.on("execute", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args } = data;
	return void (await Cli.respon.Exec(args.join(" ")).then((value) => {
		Cli.reply(from, util.format(String(value)), id)
	}).catch((err) => Cli.reply(from, util.format(String(err)), id)))
}, { event: ["$ <execute>"], command: "$", tag: "owner", withPrefix: false, isOwner: true, isQuerry: true, antispam: false })

export var Publik: void = globalThis.Client.on("publik", async function (data: HandlingData, Cli: ClientMessage) {
	const { from, id, config } = data;
	if (Public.public) return Cli.reply(from, "Bot Saat Ini sudah publik", id);
	SettingsPublic(true, config.cookies)
	Cli.reply(from, "Berhasil mengubah status menjadi publik ketik *self* jika kamu ingin mengubah status bot menjadi self", id)
}, { event: ["publik"], command: ["public", "publik"], withPrefix: false, tag: "owner", isOwner: true })

export var Self: void = globalThis.Client.on("self", async function (data: HandlingData, Cli: ClientMessage) {
	const { from, id, config } = data;
	if (!Public.public) return Cli.reply(from, "Bot Saat Ini sudah Self", id);
	SettingsPublic(false, config.cookies)
	Cli.reply(from, "Berhasil mengubah status menjadi self ketik *publik* jika kamu ingin mengubah status bot anda menjadi publik", id)
}, { event: ["self"], command: ["self"], withPrefix: false, tag: "owner", isOwner: true })

export var ClearChat: void = globalThis.Client.on("clear-chat", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id } = data;
	let getValues: string[] = Cli.client.chats.all().map((value) => value.jid)
	for (let Hasil of getValues) {
		setTimeout(async () => {
			await Cli.client.modifyChat(Hasil, 'clear').catch(() => {})
		}, 5000)
	}
	await Cli.reply(from, "Berhasil melakukan clear chat", id)
}, { event: ["clearall"], tag: "owner", command: "clearall", isOwner: true, loading: true })