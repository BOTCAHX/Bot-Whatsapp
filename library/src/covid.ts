import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';


export var InfoCovid: void = globalThis.Client.on("Covid Info", async (data: HandlingData, Cli: ClientMessage) => {
	const { createAPI, from, id } = data;
	var { CovidData  } = createAPI;
	return void await CovidData()
	.then((respon) => Cli.reply(from, `ㅤㅤㅤㅤ  *「 COVID DATA INDO 」*\n\n*➖ Negatif :* ${respon.total_spesimen_negatif}\n*➕ Positif :* ${respon.total_spesimen}\n*👨🏻‍⚕️ ODP :* ${respon.jumlah_odp}\n*😷 PDP :* ${respon.jumlah_pdp}`, id))
}, { event: ["covidinfo"], command: "covidinfo", tag: "information" })

export var UpdateCovid: void = globalThis.Client.on("Covid Update", async (data: HandlingData, Cli: ClientMessage) => {
	const { createAPI, from, id } = data;
	var { CovidUpdate  } = createAPI;
	return void await CovidUpdate()
	.then((respon) => Cli.reply(from, `ㅤㅤㅤㅤ  *「 COVID UPDATE 」*\n\n*➕ Positif :* ${respon.jumlah_positif}\n*🧑🏻 Sembuh :* ${respon.jumlah_sembuh}\n*💂🏻‍♂️ Meninggal :* ${respon.jumlah_meninggal}\n*👨🏻‍⚕️ Di Rawat :*${respon.jumlah_dirawat}\n*⏲ Tanggal :* ${respon.tanggal}`, id))
}, { event: ["covidupdate"], command: "covidupdate", tag: "information" })

export var Covid: void = globalThis.Client.on("Covid", async (data: HandlingData, Cli: ClientMessage) => {
	const { createAPI, from, id } = data;
	var {  CovidTotal } = createAPI;
	return void await  CovidTotal()
	.then((respon) => Cli.reply(from,`ㅤㅤㅤㅤ  *「 COVID TOTAL 」*\n\n*➕ Positif :* ${respon.jumlah_positif}\n*🧑🏻 Sembuh :* ${respon.jumlah_sembuh}\n*💂🏻‍♂️ Meninggal :* ${respon.jumlah_meninggal}\n*👨🏻‍⚕️ Di Rawat :*${respon.jumlah_dirawat}`, id))
}, { event: ["covid"], command: "covid", tag: "information" });