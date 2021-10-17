import { HandlingData, IConfiguration } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import * as fs from "fs";

let Path: string = "./library/database/config.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify({ 
	"public": false,
	"antipakistan": false
} as IConfiguration))

export var NoPakistan = globalThis?.Client?.on("Anti Pakistan", (data: HandlingData, Cli: ClientMessage) => {
	const { from, args, id } = data;
	let test: "on" | "off" | null = /^(on)$/i.test(args[0]) ? "on" : /^(off)$/i.test(args[0]) ? "off" : null;
	if (!test) return Cli.reply(from, "*「❗」*  Maaf kak format yang kakak masukkan salah, pilih on/off", id);
	const database: IConfiguration = JSON.parse(fs.readFileSync(Path).toString());
	if (database.antipakistan && test === "on") return Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur anti pakistan sudah di aktifkan sebelumnya", id);
	if (!database.antipakistan && test === "off") return Cli.reply(from, "*「❗」* Mohon maaf kak, Fitur anti pakistan sudah di matikan sebelumnya", id);
	database.antipakistan = test === "on";
	fs.writeFileSync(Path, JSON.stringify(database, null, 2))
	return void Cli.reply(from, `*✅* Berhasil ${test === "on" ? "Menyalakan" : "Mematikan"} fitur antipakistan`, id)
}, { event: ["antipakistan <on/off>"], command: "antipakistan", tag: "owner", isOwner: true, })