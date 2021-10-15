import { LogLogin, getBuffer, getUrl,  Tunggu,  RandomName, Runtime, autoPath, UserAgent, RandomArray,  Checkker  } from "../functions/function";
import { Exec, convertToWebp, createWmSticker, WebpToGif, WebpToMp4, convertWebpNoCrop, CreateImageToCircle  } from "../tools"
import {  FunctionMethod, ToolsMethod } from "../typings";
import { Ucapan } from "./static";
import {  createExif } from "./createExif";
import Triggered from "../tools/triggered";


const Functions: FunctionMethod  = {
	LogLogin,
	getBuffer,
	getUrl,
	Tunggu,
	RandomName,
	Runtime,
	Ucapan,
	autoPath,
	createExif,
	UserAgent,
	RandomArray,
	Checkker
}
const Tools: ToolsMethod = {
	Exec,
	convertToWebp,
	createWmSticker,
	WebpToGif,
	WebpToMp4, 
	Triggered,
	convertWebpNoCrop,
	CreateImageToCircle 
}
export const response: FunctionMethod | ToolsMethod = {
	...Functions,
	...Tools
}