import { HandlingData } from '../../typings';
import { ClientMessage } from '../../Base/Scripts/client';


export var Troli: void = globalThis.Client.open("Anti Troli", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, typeQuoted, isBot } = data;
	if (typeQuoted === Cli.Type.product && isBot) {
		Cli.client.modifyChat(from, 'clear').catch(() => {})
		return "Troli anak babi"
	}
}, { isBot: false })