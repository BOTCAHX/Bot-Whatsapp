import ffmpeg from "fluent-ffmpeg";
import { autoPath } from "../functions/function";
import * as fs from "fs";
import { exec } from "child_process";
import { config } from "dotenv";
config({ path: "./.env"})


export const convertWebpNoCrop = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		const Path: string = autoPath("webp")
		ffmpeg(input)
		.inputFormat(`${input.split('.')[2]}`)
        .on('error', function (error) {
			if (fs.existsSync(input)) fs.unlinkSync(input)
			if (fs.existsSync(Path)) fs.unlinkSync(Path)
			return reject(error)
		})
		.on('end', async function () {
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return resolve(Path)
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(Path)
	})
}
export const convertToWebp = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		const Path: string = autoPath("webp")
		await ffmpeg(input)
		.outputOptions(['-vcodec', 'libwebp', "-framerate", "20", '-vf', `crop=w='min(min(iw\,ih)\,512)':h='min(min(iw\,ih)\,512)',scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,fps=15`, "-qscale", "50", "-fs", "1M", '-loop', '0', '-preset', 'default', '-an', '-vsync', '0', '-s', '512:512'])
		.save(Path)
		.on("error", (err) => {
			if (fs.existsSync(Path)) fs.unlinkSync(Path)
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return reject(new Error(err))
		})
		.on('end', () => {
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return resolve(Path)
		})
	})
}
export const createWmSticker = async (input: string, exif?: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		await exec(`webpmux -set exif ${exif} ${input} -o ${input}`, function (err) {
			if (err) {
				fs.unlinkSync(input)
				return reject(new Error(String(err)))
			} else {
				return resolve(input)
			}
		})
	})
}