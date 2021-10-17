import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';



export var Coy = globalThis.Client.on("coy", (data: HandlingData, Cli: ClientMessage) => {
	console.log('woi')
}, { event: ["li babi"], command: "oi", withPrefix: false, tag: "ajg"})