import { WAConnection } from '@adiwajshing/baileys';
import { MainHandler } from "./Scripts";
import { Websites } from "../routers/connections/createOpenWeb";
import WebData from "../routers/Web/Server/server";
import { Socket } from "socket.io";
import chalk from "chalk";
import moment from "moment-timezone";

moment.tz.setDefault('Asia/Jakarta').locale('id');

const Web: Websites  = new Websites ();

/**
 * [Connected description]
 */
class Connected extends WebData{
	/**
	 * [client description]
	 *
	 * @return  {[type]}  [return description]
	 */
	public client: WAConnection = new WAConnection();
	/**
	 * [client description]
	 *
	 * @var {[type]}
	 */
	public Handler: MainHandler = new MainHandler(this.client, this, { isWeb: false });
	public Total: number = 0;
	constructor () {
		super(Web);
		this.sendRespon()
		globalThis.Pengintip = this.Total;
		this.App.io.on("connection", (socket: Socket) => {
			this.App.app.get("/connect", (req, res) => {
				if ((req as any).user) {
					socket.emit("create", req.cookies)
					res.redirect("/")
				} else {
					res.redirect("/")
				}
			})
			socket.on("join", () => {
				this.Total = this.Total + 1;
				this.App.io.emit("joined-user", this.Total)
				console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'),  chalk.green("User Join The Website"), chalk.yellow("Total :" + this.Total), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.hex('#f2ff03')('[DATE] =>'),chalk.greenBright(moment(new Date()).format("LLLL").split(' GMT')[0]))
			})
			socket.on("disconnect", () => {
				this.Total = this.Total - 1;
			})
			this.App.on("create", (cookie) => {
				this.client = new WAConnection();
				this.Handler = new MainHandler(this.client, this, { isWeb: true, path: "./library/routers/account/" + cookie + ".json", cookies: cookie, database: "./library/routers/account/database/" + cookie + "-"});
				this.sendRespon()
			})
		})
	}
	/**
	 * [log description]
	 *
	 * @param   {[type]}  err  [err description]
	 * @param   {[type]}  err  [err description]
	 *
	 * @return  {[type]}       [return description]
	 */
	public async sendRespon () {
		try {
			this.Handler.BeforeConnect()
			this.Handler.AfterConnect()
			this.Handler.DetectorConnect()
		} catch (err) {
			console.log(err)
		}
	}
}

new Connected()