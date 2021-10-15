export declare interface InfoDataCovid {
	id: number;
    jumlah_odp: number;
    jumlah_pdp: number;
    total_spesimen: number;
    total_spesimen_negatif: number;
}

export declare interface InfoUpdateCovid {
	jumlah_positif: number;
	jumlah_meninggal: number;
	jumlah_sembuh: number;
	jumlah_dirawat: number;
	tanggal: string;
	created: string;
}

export declare interface InfoTotalCovid {
	jumlah_positif: number;
    jumlah_dirawat: number;
    jumlah_sembuh: number;
    jumlah_meninggal: number;
}