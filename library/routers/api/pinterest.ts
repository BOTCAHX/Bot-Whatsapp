import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Uploaders from "./upload";
import { UserAgent, RandomArray } from "../../functions/function";
import cheerio, { CheerioAPI } from "cheerio";
import { config } from "dotenv";
config({ path: './env' })

let getCookies: { cookie?: string} = {
	"cookie": process.env.cookiePinterest
}
if (!getCookies?.cookie) getCookies = {}


export default class Pinterest extends Uploaders {
	constructor () {
		super()
	}
	private BaseUri: string = "https://id.pinterest.com/search/pins/";
	private ParseQuerry = (title: string): string => {
		return "?q=" + title + "&rs=typed&term_meta[]=" + title + "%7Ctyped";
	}
	private getParamsPinterest = async (title: string, headers?: AxiosRequestConfig): Promise <AxiosResponse> => {
		return new Promise (async (resolve, reject) => {
			headers = headers ?? {
				headers: {
					"User-Agent": UserAgent("Windows"),
					...getCookies
				}
			};
			const respon: AxiosResponse = await axios.request({
				url: encodeURI(this.BaseUri + this.ParseQuerry(title)),
				method: "GET",
				...headers
			})
			return resolve(respon as AxiosResponse)
		})
	}
	private ParseHTMLPinterest =  (data: AxiosResponse): string[] => {
		const $: CheerioAPI = cheerio.load(data.data);
		const hasil: string[] = [];
		$("div > div > div > div > div > div > div:nth-child(1) > div > div > div > div:nth-child(1)").each(function (a, b) {
			$(b).find("div").each(function (c, d) {
				const url: string | undefined = $(d).find("a > div > div > div > div > div > div > div > img").attr("src")
				if (!url) return;
				hasil.push(url.replace(/236x/, "originals"))
			})
		})
		return hasil
	}
	private BasePinDownload: string = "https://www.expertsphp.com/download.php";
	private getParamsPinDownloader = (url: string): Promise <AxiosResponse> => {
		return new Promise (async (resolve, reject) => {
			await axios({
				url: this.BasePinDownload,
				method: "POST",
				headers: {
					"User-Agent": UserAgent("Windows")
				},
				data: new URLSearchParams(Object.entries({ url: url }))
			}).then((data) => resolve(data))
			.catch((err) => reject(err))
		})
	}
	public RegPinterestDown: RegExp = /(?:http(?:s|):\/\/|)(?:www\.|)(id\.)pinterest(\.com)\/pin\/([0-9]{12,28}\/(?:\/|))/gi;
	public PinterestDown = async (url: string): Promise <string|undefined> => {
		let Regex: RegExpMatchArray | null = url.match(this.RegPinterestDown);
		if (!Regex) return;
		let getBase: string =  (await this.getParamsPinDownloader(Regex[0])).data;
		const $: CheerioAPI = cheerio.load(getBase)
		let hasil: string | undefined = $("#showdata").find("div:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a").attr("href") || $("#showdata").find("div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(1) > a").attr("href");
		return hasil;
	}
	public  Pinterest = async (title: string, headers?: AxiosRequestConfig): Promise <string[]|null> => {
		return new Promise (async (resolve, reject) => {
			let getBase: AxiosResponse | null = null;
			try {
				getBase = await this.getParamsPinterest(title, headers)
			} catch (err) {
				return reject(err)
			} finally {
				if (!getBase) return resolve(null);
				let hasil: string[] = this.ParseHTMLPinterest(getBase);
				hasil = hasil.filter(function(res1, res2) {
					return hasil.indexOf(res1) == res2
				})
				hasil = RandomArray(hasil) as string[];
				return resolve(hasil)
			}
		})
	}
}