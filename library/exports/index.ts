import { HandlingData, getCommand } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';

let handle = (data: HandlingData, Cli: ClientMessage) => {
	return void Cli.reply(data.from, "Test Command Export", data.id)
}

export let testExpor: getCommand = {
	event: ["halo"],
	tag: "test",
	callback: handle,
	command: "haloo",
	withPrefix: false,
	isOwner: true,
	skipMenu: true
} as getCommand