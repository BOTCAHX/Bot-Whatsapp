import express, { Express } from "express";
import SocketIo from "socket.io";
import { createServer, Server } from "http";
import chalk from "chalk";
import { EventEmitter } from "events";
import { config } from "dotenv";
config({ path: "./.env"})

export  class Websites  extends EventEmitter {
	public app: Express;
	public port: number = Number(process.env.port) || 8080 || 3030;
	public server: Server;
	public io: SocketIo.Server
	constructor () {
		super()
		this.app = express()
		this.server = createServer(this.app)
		this.io = new SocketIo.Server(this.server)
		this.server.listen(this.port, () => {
			console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'),  chalk.magentaBright("Connected To Server : " + "http://localhost:" + this.port))
		})
	}
}