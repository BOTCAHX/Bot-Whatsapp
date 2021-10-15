import axios, { AxiosResponse } from "axios";
import * as fs from "fs";
import { JooxAll, JooxItems, SongInfo, JooxDown, JooxInterfaceDown, Joox, JooxKBPSMap, jooxPlayMusic  } from "../../typings";
import { UserAgent } from "../../functions/function";
import filesize from "filesize";
import Google from "./google"


export default class JOOXMusik extends Google {
	constructor () {
		super()
	}
	public RegexJoox: RegExp = /(?:http(?:s|):\/\/|)(?:www\.|)joox(\.com)\/id\/(?:single|album|playlist)\/([+=-_0-9A-Za-z]{6,38})/gi
	public JooxDownloader = async (id: string): Promise <JooxDown|null> => {
		return new Promise(async (resolve, reject) => {
			try {
				// Free Cookies Joox
				// Kalo Luar indo pakein Proxy ngab
				const getUrl: AxiosResponse = await axios.get(encodeURI(`http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${id}`), {
					headers: {
						"User-Agent": UserAgent(),
						"cookie": "wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;"
					},
					proxy: JSON.parse(fs.readFileSync("./app.json").toString())
				})
				if (getUrl.status !== 200) return resolve(null)
				const data: JooxInterfaceDown = JSON.parse(getUrl.data.replace('MusicInfoCallback(', '').replace('\n)', ''))
				const format: JooxDown  = {
					url: data.mp3Url,
					size: filesize(data.size128)
				}
				return resolve(format)
			} catch (err) {
				return reject(err)
			}
		})
	}
	public JooxMetadataDown = async (id: string): Promise <JooxInterfaceDown> => {
		return new Promise (async (resolve, reject) => {
			try {
				const getUrl: AxiosResponse = await axios.get(encodeURI(`http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${id}`), {
					headers: {
						"User-Agent": UserAgent(),
						"cookie": "wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;"
					},
					proxy: JSON.parse(fs.readFileSync("./app.json").toString())
				})
				const data: JooxInterfaceDown = JSON.parse(getUrl.data.replace('MusicInfoCallback(', '').replace('\n)', ''))
				return resolve(data)
			} catch (err) {
				return reject(err)
			}
		})
	}
	public JooxSearch = async (title: string): Promise <Joox[]|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				const data: AxiosResponse = await axios({
					url: encodeURI(`https://api-jooxtt.sanook.com/openjoox/v3/search?country=id&lang=id&keyword=${title}`),
					method: "GET",
					headers: {
						"accept": "application/json, text/plain, */*",
						'user-agent': UserAgent()
					},
					proxy: JSON.parse(fs.readFileSync("./app.json").toString())
				})
				let result: Joox[] = []
				data.data.section_list.find((values: JooxAll) => values.section_title === "Lagu").item_list.map((values: JooxItems) => values.song.map((value: SongInfo) => value.song_info)).map((value: Joox[]) => { result.push(value[0])})
				if (!result[0]) return resolve(null)
				return resolve(result)
			} catch (err) {
				return reject(err)
			}
		})
	}
	public JooxPlay = async (title: string): Promise <jooxPlayMusic|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				let Data: Joox[] | null = await this.JooxSearch(title);
				if (!Data) return resolve(null);
				const getData: JooxInterfaceDown = await this.JooxMetadataDown(Data[0].id);
				const getKualitas: JooxKBPSMap = JSON.parse(getData.kbps_map.replace("\n", ""))
				const result: jooxPlayMusic = {
					id: Data[0].album_id,
					title: getData.msong,
					artist: getData.msinger,
					thumbnail: Data[0].images[0],
					publikasi: getData.public_time,
					language: getData.country,
					durasi: Data[0].play_duration,
					quality: getKualitas,
					down: {
						mp3: getData.mp3Url,
						m4a: getData.m4aUrl,
						r192: getData.r192Url,
						r320: getData.r320Url
					}
				}
				return resolve(result)
			} catch (err) {
				return reject(err)
			}
		})
	}
}