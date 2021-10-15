import axios, { AxiosResponse } from "axios";
import Pinterest from "./pinterest";
import { InfoDataCovid, InfoUpdateCovid, InfoTotalCovid  } from "../../typings"



export default class Covid extends Pinterest {
	constructor() {
		super()
	};
	private BaseUrl: string = `https://data.covid19.go.id/public/api/update.json`;
	public CovidData = async (): Promise <InfoDataCovid> => {
		const data: AxiosResponse = await axios.get(this.BaseUrl);
		return data.data.data as InfoDataCovid
	}
	public CovidUpdate = async (): Promise <InfoUpdateCovid> => {
		const data: AxiosResponse = await axios.get(this.BaseUrl);
		return data.data.update.penambahan as InfoUpdateCovid
	}
	public CovidTotal = async (): Promise <InfoTotalCovid> => {
		const data: AxiosResponse = await axios.get(this.BaseUrl);
		return data.data.update.total as InfoTotalCovid 
	}
}