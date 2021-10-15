import axios from "axios";
import FormData from "form-data";
import { UserAgent } from "../../functions/function";
import * as fs from "fs";
import { UguuSee } from "../../typings"

export default class Uploaders {
	constructor () {}
	public Ugusee = async (file: string): Promise <UguuSee> => {
		return new Promise (async (resolve, reject) => {
			if (fs.existsSync(file)) return reject(new Error("File Gada"))
			const Form: FormData = new FormData();
			Form.append("files[]", fs.createReadStream(file))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": UserAgent()
				},
				data: Form
			}).then(({ data }) => {
				return resolve(data.files[0] as UguuSee)
			}).catch((err) => reject(err))
		})
	};
	public TelegraPh = async (file: string): Promise <string> => {
		return new Promise (async (resolve, reject) => {
			if (fs.existsSync(file)) return reject(new Error("File Gada"))
			const Form: FormData = new FormData();
			Form.append("files", fs.createReadStream(file))
			await axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					"User-Agent": UserAgent(),
					...Form.getHeaders()
				},
				data: Form
			}).then(({ data }) => {
				return resolve(data[0].src as string)
			}).catch((err) => reject(err))
		})
	}
}