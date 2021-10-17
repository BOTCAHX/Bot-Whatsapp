import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import moment from "moment-timezone";

export var GhStalk = globalThis.Client.on("Github Stalk", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, args, id, createAPI } = data;
	var { GithubStalk } = createAPI;
	return void await GithubStalk(args[0]).then(async (respon) => {
		if (!respon) return Cli.reply(from, "*「❗」* Mohon maaf kak, Username yang kakak cari tidak ditemukan", id)
		let Text: string = `	ㅤㅤ   *「 GITHUB STALK 」*


*💫 URL :* ${respon.html_url}
*🌐 ID :* ${respon.id}
*🕵🏻‍♂️ Username :* ${respon.login}
*👤 Nama :* ${respon.name}
*👥 Pengikut :* ${respon.followers}
*🫂 Mengikuti :* ${respon.following}
*🔰 Type :* ${respon.type}
*🏬 Company :* ${respon.company || "Tidak terdata"}
*🧭 Blog :* ${respon.blog || "Tidak terdata"}
*💌 Email :* ${respon.email || "Email tidak terdeteksi"}
*🛡️ Bio :* ${respon.bio || "Tidak ada bio"}
*🖥️ Username Twitter :* ${respon.twitter_username || "Tidak di cantumkan"}
*💠 Repo Publik :* ${respon.public_repos}
*💥 Git Publik :* ${respon.public_gists}
*🎥 Tanggal Buat :* ${moment(respon.created_at).format("LLLL")}
*🕒 Tanggal Update :* ${moment(respon.updated_at).format("LLLL")}`
     return void await Cli.sendFile(from, respon.avatar_url, { caption: Text, quoted: id})
	}).catch(async () => await Cli.reply(from, "*「❗」* Mohon maaf kak, Username yang kakak cari tidak ditemukan", id))
}, { event: ["ghstalk <username>"], tag: "stalk", command: ["ghstalk", "githubstalk"], isUsername: true, loading: true })