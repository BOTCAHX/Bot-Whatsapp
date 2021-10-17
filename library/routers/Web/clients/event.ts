import {  Websites } from "../../connections/createOpenWeb";
import crypto from "crypto";
import * as fs from "fs";
import { config } from "dotenv";

config({ path: "./.env"})

const Tokens: any = {};
const Path: string = "./library/routers/account/"


// Ga Rapi ? Rapiin Sendiri lah asw
//
//
export class EventClients  {
	constructor(public App: Websites) {
		this.App.app.use((req: any, res, next) => {
			const auth: string = req.cookies.AuthToken;
			req.user = Tokens[auth];
			next()
		})
		this.App.app.post("/auth", (req, res) => {
			const { Email, Password } = req.body;
			if (Email === "rayyreall29" && Password === "rayyreall") {
				const auth: string  = crypto.randomBytes(32).toString("hex");
				Tokens[auth] = "admin";
				res.cookie("AuthToken", auth)
				res.redirect("/")
			} else if (Email && Password) {
				const auth: string  = crypto.randomBytes(32).toString("hex");
				Tokens[auth] = "visitor";
				res.cookie("AuthToken", auth)
				res.redirect("/")
			} else {
				res.render("login.ejs", { name: "Harap Diisi"})
			}
		})
		this.App.app.post("/config", (req, res) => {
			const { nama_bot, nomer } = req.body;
			if ((req as any).user) {
				if (!fs.existsSync(Path + "database/" + req.cookies.AuthToken + ".json")) fs.writeFileSync(Path + "database/" + req.cookies.AuthToken + ".json", JSON.stringify({ nama_bot: nama_bot || "", nomer: nomer + "@s.whatsapp.net" || "33753045534" + "@s.whatsapp.net", status: false, server: process.env.server, public: false }))
				if (fs.existsSync(Path + "database/" + req.cookies.AuthToken + ".json")) {
					const database: { nama_bot: string, nomer:  string, status: boolean } = JSON.parse(fs.readFileSync(Path + "database/"+ req.cookies.AuthToken + ".json").toString())
					fs.writeFileSync(Path + "database/" + req.cookies.AuthToken + ".json", JSON.stringify({
						owner: nama_bot || database.nama_bot || "RA BOT",
						nomer: nomer || database.nomer || "33753045534",
						nama_bot: nama_bot || "",
						status: false,
						server: process.env.server,
						public: false
					}))
					res.render("profile.ejs", {  config: true, })
				}
		} else {
			res.redirect("/")
		}
		})
		this.App.app.get("/connect", (req, res) => {
			if (!fs.existsSync(req.cookies.AuthToken + ".json")) fs.writeFileSync(Path + "database/" + req.cookies.AuthToken + ".json", JSON.stringify({ nama_bot: "RA BOT", nomer: "33753045534" + "@s.whatsapp.net" , status: false, server: process.env.server, public: false }))
			if((req as any).user) {
				this.App.emit("create", req.cookies.AuthToken)
				res.render("profile.ejs")
			} else {
				res.redirect("/")
			}
		})
		this.App.app.get('/', (req, res) => {
			if ((req as any).user) {
				res.render("profile.ejs", { pengintip: globalThis.Pengintip })
			} else {
				res.render("main.ejs")
			}
		})
		this.App.app.get("/login", (req, res) => {
			res.render("login.ejs")
		})
	}
}