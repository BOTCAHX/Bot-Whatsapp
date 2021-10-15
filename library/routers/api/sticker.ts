import axios from "axios";
import Covid from "./covid";
import filetype, { FileTypeResult } from "file-type";
import * as fs from "fs";
import { ImageStickerOpenWa,  IStickerMetadata, VideoStickerOpenWa } from "../../typings"


export default class StickerCreate  extends Covid {
	constructor () {
		super()
	};
	public OpenWaStickerImage = async (file: Buffer | string, stickerMetadata?: IStickerMetadata): Promise <Buffer> => {
		return new Promise(async (resolve, reject) => {
			if (stickerMetadata) {
				if (!stickerMetadata.author) stickerMetadata.author = "rayyreall";
				if (!stickerMetadata.pack) stickerMetadata.pack = "RA BOT";
				stickerMetadata.keepScale = (stickerMetadata.keepScale !== undefined) ? stickerMetadata.keepScale : false;
				stickerMetadata.circle = (stickerMetadata.circle !== undefined) ? stickerMetadata.circle : false
			} else if (!stickerMetadata) {
				stickerMetadata = {
					author: "rayyreall",
					pack: "RA BOT",
					keepScale: false,
					circle: false,
					removebg: "HQ"
				};
			}
			let getBase64: string | null = Buffer.isBuffer(file) ? file.toString("base64") : (typeof file === "string" && fs.existsSync(file)) ? fs.readFileSync(file).toString("base64") : null;
			let FileType: string | undefined = (typeof file === "string" && fs.existsSync(file)) ? (await filetype.fromFile(file))?.mime : Buffer.isBuffer(file) ? (await filetype.fromBuffer(file))?.mime : undefined;
			if (!FileType) return reject(new Error("File Type Undefined"))
			if (!getBase64) return reject(new Error("File Base64 undefined"))
			const Format: ImageStickerOpenWa = {
				image: `data:${FileType};base64,${getBase64}`,
				stickerMetadata: {
					...stickerMetadata
				},
				sessionInfo: {
					WA_VERSION: "2.2106.5",
					PAGE_UA: "WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
					WA_AUTOMATE_VERSION: "3.6.10 UPDATE AVAILABLE: 3.6.11",
					BROWSER_VERSION: "HeadlessChrome/88.0.4324.190",
					OS: "Windows Server 2016",
					START_TS: 1614310326309,
					NUM: "6247",
					LAUNCH_TIME_MS: 7934,
					PHONE_VERSION: "2.20.205.16"
				},
				config: {
					sessionId: "session",
					headless: true,
					qrTimeout: 20,
					authTimeout: 0,
					cacheEnabled: false,
					useChrome: true,
					killProcessOnBrowserClose: true,
					throwErrorOnTosBlock: false,
					chromiumArgs: [
					  "--no-sandbox",
					  "--disable-setuid-sandbox",
					  "--aggressive-cache-discard",
					  "--disable-cache",
					  "--disable-application-cache",
					  "--disable-offline-load-stale-cache",
					  "--disk-cache-size=0"
					],
					executablePath: "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
					skipBrokenMethodsCheck: true,
					stickerServerEndpoint: true
				  }
			}
			await axios({
				url: "https://sticker-api-tpe3wet7da-uc.a.run.app/prepareWebp",
				method: "POST",
				headers: {
					Accept: "application/json, text/plain, /",
					"Content-Type": "application/json;charset=utf-8",
					"User-Agent": "axios/0.21.1",
					"Content-Length": 151330
				},
				data: JSON.stringify(Format)
			}).then((data) => {
				return resolve(new Buffer(data.data.webpBase64, "base64"))
			}).catch((err) => reject(err))
		})
	};
	public OpenWaSticker = async (file: Buffer | string, stickerMetadata?: IStickerMetadata): Promise<Buffer> => {
		return new Promise (async (resolve, reject) => {
			const FileType: FileTypeResult | undefined = Buffer.isBuffer(file) ?  await filetype.fromBuffer(file) : await filetype.fromFile(file);
			switch(FileType?.ext) {
				case "mp4":
				case "gif":
				     await this.OpenWaStickerMP4(file, stickerMetadata).then(async (respon) => {
						 return resolve(respon)
					 }).catch((err) => reject(err))
				break
				case "png":
				case "jpg":
				    await this.OpenWaStickerImage(file, stickerMetadata).then(async (respon) => {
						return resolve(respon)
					}).catch((err) => reject(err))
				break
				default: 
				return reject(new Error("Media Not Support"))
			}
		})
	}
	public OpenWaStickerMP4 = async (file: Buffer | string, stickerMetadata?: IStickerMetadata): Promise <Buffer> => {
		return new Promise(async (resolve, reject) => {
			if (stickerMetadata) {
				if (!stickerMetadata.author) stickerMetadata.author = "rayyreall";
				if (!stickerMetadata.pack) stickerMetadata.pack = "RA BOT";
				stickerMetadata.keepScale = (stickerMetadata.keepScale !== undefined) ? stickerMetadata.keepScale : false;
			} else if (!stickerMetadata) {
				stickerMetadata = {
					author: "@rayyreall",
					pack: "RA BOT",
					keepScale: false
				};
			}
			let getBase64: string | null = Buffer.isBuffer(file) ? file.toString("base64") : (typeof file === "string" && fs.existsSync(file)) ? fs.readFileSync(file).toString("base64") : null;
			let FileType: string | undefined = (typeof file === "string" && fs.existsSync(file)) ? (await filetype.fromFile(file))?.mime : Buffer.isBuffer(file) ? (await filetype.fromBuffer(file))?.mime : undefined;
			if (!FileType) return reject(new Error("File Type Undefined"))
			if (!getBase64) return reject(new Error("File Base64 undefined"))
			const Format: VideoStickerOpenWa = {
				file: `data:${FileType};base64,${getBase64}`,
				processOptions: {
					crop: (stickerMetadata.keepScale !== undefined) ? stickerMetadata.keepScale : false,
					fps: 10,
					startTime: "00:00:00.0",
					endTime: "00:00:7.0",
					loop: 0
				},
				stickerMetadata: {
					...stickerMetadata
				},
				sessionInfo: {
					WA_VERSION: "2.2106.5",
					PAGE_UA: "WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
					WA_AUTOMATE_VERSION: "3.6.10 UPDATE AVAILABLE: 3.6.11",
					BROWSER_VERSION: "HeadlessChrome/88.0.4324.190",
					OS: "Windows Server 2016",
					START_TS: 1614310326309,
					NUM: "6247",
					LAUNCH_TIME_MS: 7934,
					PHONE_VERSION: "2.20.205.16"
				},
				config: {
					sessionId: "session",
					headless: true,
					qrTimeout: 20,
					authTimeout: 0,
					cacheEnabled: false,
					useChrome: true,
					killProcessOnBrowserClose: true,
					throwErrorOnTosBlock: false,
					chromiumArgs: [
					  "--no-sandbox",
					  "--disable-setuid-sandbox",
					  "--aggressive-cache-discard",
					  "--disable-cache",
					  "--disable-application-cache",
					  "--disable-offline-load-stale-cache",
					  "--disk-cache-size=0"
					],
					executablePath: "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
					skipBrokenMethodsCheck: true,
					stickerServerEndpoint: true
				  }
			}
			await axios({
				url: "https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl",
				method: "POST",
				headers: {
					Accept: "application/json, text/plain, /",
					"Content-Type": "application/json;charset=utf-8",
					"User-Agent": "axios/0.21.1"
				},
				data: JSON.stringify(Format)
			}).then((data) => {
				return resolve(new Buffer(data.data.split(";base64,")[1], "base64"))
			}).catch((err) => reject(err))
		})
	}
}