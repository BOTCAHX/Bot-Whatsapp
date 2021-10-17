import { HandlingData, getCommand } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';


let handle = (data: HandlingData, Cli: ClientMessage)  => {
	const { from, id } = data;
	return void Cli.sendButtons(from,  { text: "Kalo mau Via Export disini", subtitle: "@by Ra", buttons: [ { Text: "pencet buton", id: "12"}]})
}

export let hayy: getCommand  = {
	event: ["testa"],
	tag: "testas",
	callback: handle,
	command: ["hay"],
	isOwner: true,
	skipMenu: true
} as getCommand 