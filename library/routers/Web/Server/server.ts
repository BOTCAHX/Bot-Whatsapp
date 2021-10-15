import express from "express";
import { Websites as Base } from "../../connections/createOpenWeb";
import { Router, urlencoded } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { EventClients as CreateConnections } from "../clients/event";
import Cookies from "cookie-parser";


export default class HandlerWebsites {
	public clientRouters: Router = Router();
	constructor (public App: Base) {
		this.App.app.enable("trust proxy");
		this.App.app.set("json spaces", 2);
		this.App.app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, recording-session")
			next()
		})
		this.App.app.use("/client", this.clientRouters)
		this.App.app.use("/", urlencoded({ extended: false }))
		this.App.app.set("views", "./library/routers/Web/views")
		this.App.app.use(bodyParser.json());
		this.App.app.use(bodyParser.urlencoded({extended: false}));
		this.App.app.use(cors());
		this.App.app.use(Cookies())
		this.App.app.use(express.static('./library/routers/Web/views'));
		this.App.app.set('view-engine', 'ejs')
		new CreateConnections(this.App)
	}
}