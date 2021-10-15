import { Eval,  Execute } from "./eval";
import { Menu, Owner } from "./menu";
import { Sticker } from "./sticker";
import { Tomp3 } from "./converter";
import { YtSearch } from "./youtube";
import { MultiPrefix } from "./prefix";
import { Tiktokstalk } from "./tiktok";
import { SearchJoox } from "./joox";
import { googleSearch } from "./google";
import { Circle } from "./manipulation";
import { AddStickerCmd } from "./isStickerCmd";
import { groupPromote } from "./groupAction";
import { GhStalk} from "./github";
import { NoPakistan } from "./antipakistan";
import { broadcast } from "./broadcast";
import { InfoCovid } from "./covid";
import {  Pinterest } from "./pinterest";
import { ToUrl } from "./tourl";

// Export 1 aja Bro perwakilan soalnya klo gada di satuin error
// Muewehehe
export  function onPattern (): void {
	import ("../plugins/messages/index").then((data) => new data.default().run())
	Eval
	Menu
	Sticker
	Execute
	Owner
	Tomp3
	YtSearch
	MultiPrefix
	Tiktokstalk
	SearchJoox
	googleSearch
	Circle
	AddStickerCmd
	groupPromote
	GhStalk
	NoPakistan
	broadcast
	InfoCovid
	Pinterest
	ToUrl
}