import fs from "fs";
import path from "path";


export  function onPattern (){
	return new Promise (async (resolve, reject) => {
		fs.readdirSync("./library/chats/")
		.filter((extentions) => extentions.endsWith(".ts")).forEach(async (value) => {
			try {
				const getImport: any = (await import(path.join(__dirname, "../chats/", value)))
				for (let result in getImport) {
					getImport[result]
				}
			} catch (err) {
				console.log(err)
			}
		})
		fs.readdirSync("./library/plugins/messages/")
		.filter((extentions) => extentions.endsWith(".ts")).forEach(async (value) => {
			try {
				const getImport: any = (await import(path.join(__dirname, "../plugins/messages/", value)))
				for (let result in getImport) {
					getImport[result]
				}
			} catch (err) {
				console.log(err)
			}
		})
		fs.readdirSync("./library/src/").filter((main) => main !== "main.ts")
		.filter((extentions) => extentions.endsWith(".ts")).forEach(async (value) => {
			try {
				const getImport: any = (await import(path.join(__dirname,  value)))
				for (let result in getImport) {
					resolve(getImport[result])
				}
			} catch (err) {
				console.log(err)
			}
		})
	})
}