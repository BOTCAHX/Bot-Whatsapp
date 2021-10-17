import { WAConnection } from "@adiwajshing/baileys";
import { getCommand, HandlingData, EventEmitter, IRegister, IStickerCmd, EventCommand, EventsEmit, Configurations } from "../../typings";
import { ClientMessage  } from ".";
import * as fs from "fs";
import {} from "../../exports"


const Events: any = {};

export default class HandleExports {
	public EventHandle: any = Events;
	constructor () {} 
	public async getHandle (): Promise <any> {
		return new Promise (async (resolve, reject) => {
			fs.readdirSync("./library/exports").filter((extentions) => extentions.endsWith(".ts")).forEach(async (value) => {
				let getExports = (await import(__dirname + "/../../exports/" + value))
				for (let result in getExports) {
					if (result === "__esModule") continue;
					if (getExports[result].command == undefined) continue;
					if (getExports[result].event == undefined) continue;
					if(!Array.isArray(getExports[result].event)) continue;
					if (getExports[result].command === undefined) continue;
					if (typeof getExports[result].callback !== "function") continue;
					if (getExports[result].tag == undefined) continue;
					if (!this.EventHandle[result]) {
						if (getExports[result].enable == undefined) {
							getExports[result].enable = true
						}
						if (getExports[result].withPrefix == undefined) {
							getExports[result].withPrefix = true
						}
						this.EventHandle[result] = {
							nameHandle: result,
							...getExports[result]
						}
					}
				}
				return resolve(this.EventHandle as any)
			})
		})
	}
}