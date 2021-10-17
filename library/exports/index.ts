import { HandlingData, getCommand } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';

/**
 * [id description]
 *
 * @var {[type]}
 */
/*
* [data]
data is used to retrieve event data such as from, id, args, prefix, etc.

you can also see the data types in the file handler.d.ts
on HandlingData
*/ 
/*
* [Cli]
Cli is used for functions like reply, sendFile etc
or you can also look in the client.ts file
in the Base/Script Folder
*/ 
let handle = (data: HandlingData, Cli: ClientMessage) => {
	return void Cli.reply(data.from, "Test Command Export", data.id)
}

/**
 * [testExpor description]
 *
 * @var {[type]}
This is used for concatenating events you can also look in the typings folder
in file handler.d.ts

in the getCommand

to see what data is needed
 */
export let testExpor: getCommand = {
	event: ["halo"],
	tag: "test",
	callback: handle,
	command: "haloo",
	withPrefix: false,
	isOwner: true,
	skipMenu: true
} as getCommand
