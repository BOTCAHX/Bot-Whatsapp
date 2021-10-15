import { WAConnection, WAOpenResult, Browsers } from '@adiwajshing/baileys';
import chalk from "chalk";
import * as fs from "fs";
import axios, { AxiosResponse } from "axios";
import { getClientVersion, Configurations } from "../../typings";
import WebData from "../../routers/Web/Server/server";
import qrCode from "qrcode"

let Path: string = "./library/routers/account/session_bot.json";

let QrData: string | null = null;
let Qr: { id: string, total: number }[] = []

export default class Connections {
	constructor (public client: WAConnection,  public App: WebData, public Config?: Configurations) {
	}
	private LoginQr (): void {
		return void this.client.on("qr", (qr: string) => {
			let lokasi : number= Qr.findIndex((value) => value.id === this.Config?.cookies)
			if (lokasi == -1) Qr.push({ id: this.Config?.cookies as string, total: 1 })
			if (lokasi !== -1) Qr[lokasi].total = Qr[lokasi].total + 1
			let newLoc: number =  Qr.findIndex((value) => value.id === this.Config?.cookies)
			if (this.Config?.isWeb) {
				qrCode.toDataURL(qr, (err, url) => {
					QrData = url;
					this.App.App.io.emit("qr", QrData)
				})
				if (Qr[newLoc].total > 3) this.client.removeAllListeners("qr")
			} else {
				if (Qr[newLoc].total >= 3) this.client.removeAllListeners("qr")
				console.log(chalk.red('[!]'), chalk.hex('#e3ff00')('Please scan your Qr code immediately...........'))
			}
		})
	}
	private async getVersion (): Promise <[number, number, number]> {
		let respon: [number, number, number]
		try {
			const getData: AxiosResponse = await axios.get("https://web.whatsapp.com/check-update?version=1&platform=web")
			let Json: getClientVersion = getData.data;
			respon = [Number(Json.currentVersion.split(".")[0]), Number(Json.currentVersion.split(".")[1]), Number(Json.currentVersion.split(".")[2])]
		} catch (err) {
			console.log(err)
			respon = [2, 2134, 10]
		}
		return respon
	}
	private async getSessions (): Promise <WAOpenResult> {
		fs.existsSync(this.Config?.path || Path) && this.client.loadAuthInfo(this.Config?.path || Path)
		const connect: WAOpenResult = await this.client.connect();
		fs.writeFileSync(this.Config?.path || Path, JSON.stringify(this.client.base64EncodedAuthInfo(), null, 2))
		return connect
	}
	private ConfigurationBeforeLogin (version: [number, number, number]): void {
		this.client.version = version;
		this.client.logger.level = "fatal";
		this.client.browserDescription = Browsers.macOS("chrome");
	}
	public async Login (): Promise <WAOpenResult> {
		this.ConfigurationBeforeLogin(await this.getVersion())
		this.LoginQr()
		return this.getSessions()
	}
}