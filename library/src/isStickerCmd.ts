import { HandlingData, IStickerCmd, EventEmitter  } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import * as fs from "fs";


let SaveStiCmd: string = "./library/database/sticmd.json";
if (!fs.existsSync(SaveStiCmd)) fs.writeFileSync(SaveStiCmd, JSON.stringify([]));

const database: IStickerCmd[] = JSON.parse(fs.readFileSync(SaveStiCmd).toString()) as IStickerCmd[];

// Belom jadi Kembangin sendiri sono
export const AddStickerCmd = globalThis.Client.on("Add Sticker Cmd", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, isQuotedSticker, id, sender, FileSha, args, prefix } = data;
	if (isQuotedSticker) {
		let Cmd: string = args[0]
		if (args[0].startsWith(prefix)) Cmd = args[0].replace(prefix, "")
		let getValue: IStickerCmd | undefined = database.find((value: IStickerCmd) => value.id == sender)
		if (getValue) {
			if (getValue.cmd.find((value) => value.id == FileSha)) return void Cli.reply(from, "*「❗」*  Mohon maaf kak, Sticker tersebut sudah diisi perintah sebelumnya", id)
			database[database.findIndex((value) => value.id == sender)].cmd.push({ id: FileSha as string, command: Cmd })
			fs.writeFileSync(SaveStiCmd, JSON.stringify(database, null, 2))
			return Cli.reply(from, "Berhasil memasukkan cmd sticker", id)
		} else {
			database.push({ id: sender as string, cmd: [{ id: FileSha as string, command: Cmd }]})
			fs.writeFileSync(SaveStiCmd, JSON.stringify(database, null, 2))
			return void Cli.reply(from, "Berhasil memasukkan cmd sticker", id)
		}
	} else {
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, Harap reply Sticker untuk menggunakan perintah ini", id)
	}
}, { event: ["addsticker <command>"], tag: "sticker cmd", command: "addsticker", isQuerry: true, isOwner: true, skipMenu: true });
