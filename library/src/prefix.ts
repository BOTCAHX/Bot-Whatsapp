import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import * as fs from "fs";
import { IRegister } from '../typings';


let Path: string = "./library/database/register.json";

export var MultiPrefix = globalThis.Client.on("multi", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, sender } = data;
	const database: IRegister[] = JSON.parse(fs.readFileSync(Path).toString()) as IRegister[];
	const count: number = database.findIndex((value: IRegister) => value.id == sender)
	if (/(on|nyala)/i.test(args[0])) {
		if (count !== -1) {
			if (database[count].multi) return Cli.reply(from, "*「❗」* Mohon maaf kak, Prefix yang kakak gunakan saat ini sudah multi prefix", id);
			database[count].multi = true;
			fs.writeFileSync(Path, JSON.stringify(database, null, 2))
			return void await Cli.reply(from, "Berhasil mengubah status prefix menjadi multi prefix", id)
		} else {
			return void Cli.reply(from, "*「❗」* Mohon maaf kak bot gagal mengubah prefix anda, coba lagi kak", id)
		}
	} else if (/(off|mati)/i.test(args[0])) {
		if (count !== -1) {
			if (!database[count].multi) return Cli.reply(from, "*「❗」* Mohon maaf kak, Prefix yang kakak gunakan saat ini bukan multi prefix", id);
			database[count].multi = false;
			fs.writeFileSync(Path, JSON.stringify(database, null, 2))
			return void await Cli.reply(from, "*✔* Berhasil mengubah status prefix menjadi " + database[count].prefix)
		} else {
			return void Cli.reply(from, "*「❗」* Mohon maaf kak bot gagal mengubah prefix anda, coba lagi kak", id)
		}
	} else {
		return void await Cli.reply(from, "*「❗」*  Pilih on atau off jika kamu ingin mengubah status multi prefix", id)
	}
}, { event: ["multi <on/off>"],  tag: "user", command: ["multi"], withPrefix: false })

export var Prefix = globalThis.Client.on("Prefix", (data: HandlingData, Cli: ClientMessage) => {
	const { from, prefix, id } = data;
	return void Cli.reply(from, `Prefix anda untuk saat ini adalah ${prefix}`, id)
}, { event: ["prefix"], tag: "user", command: ["prefix"], withPrefix: false })

export var setPrefix = globalThis.Client.on("setprefix", (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, prefix, sender } = data;
	if (!args[0]) return void Cli.reply(from, `*「❗」*  Mohon maaf kak harap masukkan prefix yang ingin kakak ubah`, id);
	if (args[0] == prefix) return  void Cli.reply(from, `*「❗」*  Mohon maaf kak prefix yang ingin kamu ubah sama persis dengan prefix sebelumnya`, id);
	const database: IRegister[] = JSON.parse(fs.readFileSync(Path).toString()) as IRegister[];
	const count: number = database.findIndex((value: IRegister) => value.id == sender)
	if (count !== -1) {
		database[count].prefix = args[0];
		fs.writeFileSync(Path, JSON.stringify(database, null, 2))
		return void Cli.reply(from, "*✅* Berhasil mengubah prefix bot anda menjadi *" + args[0] + "*", id)
	} else {
		return void Cli.reply(from, "*「❗」* Mohon maaf kak bot gagal mengubah prefix anda, coba lagi kak", id)
	}
}, { event: ["setprefix"], tag: "user", command: "setprefix", withPrefix: false })