import { HandlingData, IMussically, ITiktokVideoMetadata, ITTDownloader } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';


export var Tiktokstalk = globalThis.Client.on("tiktok stalk", async (data: HandlingData, Cli: ClientMessage) => {
	const { createAPI, from, id, args } = data;
	var { TiktokStalk } = createAPI;
	return void (await TiktokStalk(args[0]).then(async (respon) => {
		const TanggalUpload: string = new Date(Number(respon.createTime) * 1000).toLocaleString('id', {
			year: 'numeric',
			month: 'short',
			weekday: 'short',
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric'
		})
		return void await Cli.sendFile(from, respon.avatarLarger, { quoted: id, caption: `	ㅤ *「 TIKTOK STALK 」*\n\n
*📡 ID :* ${respon.id}
*🕵🏻‍♂️ Username :* ${respon.uniqueId}
*👤 Nama :* ${respon.nickname}
*👥 Pengikut :* ${respon.follower}
*🫂  Mengikuti :* ${respon.following}
*❤ Suka :* ${respon.suka}
*🎞 Total Video :* ${respon.total_video}
*🎥 Tanggal Buat :* ${TanggalUpload}
*📧 Verived :* ${respon.verified ?  '✅' : '❎'}
*🔐 Private :* ${respon.privateAccount ?  '✅' : '❎'}
*🌐 Bio Link :* ${respon.bioLink.link ??  ''}
*🛡️ Bio :* ${respon.signature}
`})
	}))
}, { command: ["tiktokstalk", "ttstalk", "stalktt", "stalktiktok"], tag: "stalk", event: ["tiktokstalk <username>"], isUsername: true, loading: true })


export var TiktokDownloader = globalThis.Client.on("tiktok downloader", async (data: HandlingData, Cli: ClientMessage) => {
	const { args, from, id, createAPI } = data;
	var { TtDownloader, Musiccaly, MetadataVideoTiktok } = createAPI;
	let RegToktok: RegExpMatchArray | null = args.join(" ").match(/(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/@([-_0-9A-Za-z]{3,14})\/video\/([0-9]{8,50})(?:\?is_copy_url=0&is_from_webapp=v1&sender_device=pc&sender_web_id=(?:[0-9]{8,50}))|(?:http(?:s|):\/\/|)(?:(?:vt|vm)\.tiktok\.com\/([-_0-9A-Za-z]{3,14}))/g)
	if (!RegToktok) return Cli.reply(from, "*「❗」* Mohon maaf kak, harap masukkan link tiktok jika kaka ingin mendownload video Tiktok", id);
	await Cli.wait()
	let Download: ITTDownloader | IMussically | null;
	let result: ITiktokVideoMetadata | null = null;
	try {
		result = await MetadataVideoTiktok(RegToktok[0]).catch(() => {
			return null
		})
		Download = await TtDownloader(RegToktok[0])
	} catch (err) {
		if (!result) result = await MetadataVideoTiktok(RegToktok[0]).catch(() => {
			return null
		})
		Download = await Musiccaly(RegToktok[0])
	}
	let Text: string = "";
	if (result) Text =  `ㅤㅤ *「 TIKTOK DOWNLOADER 」*


*📬 Id :* ${result.id}
*👤 Username :* ${result.username}
*💌 Nama :* ${result.nickname}
*🎯 Tanggal Upload :* ${result.tanggal_buat}
*🕐 Durasi :* ${result.durasi}
*💡 Resolusi :* ${result.resolusi}
*🎁 Type :* ${result.format}
*📧 Akun Terverifikasi :* ${result.verify ?   '✅' : '❎'}
*🔐 Video Private :* ${result.video_private ?   '✅' : '❎'}
*🔷 Stlich Status :* ${result.stitchEnabled ?   '✅' : '❎'}
*🐒 Duet Status :* ${result.duetEnabled ?   '✅' : '❎'}
*🎞️ Total Tayangan :* ${result.statistic.playCount}
*🌐 Total Share :* ${result.statistic.shareCount}
*💭 Total Komen :* ${result.statistic.commentCount}
*❤ Like :* ${result.statistic.diggCount}
*🎶 Judul Musik :* ${result.music.title}
`
	if (Download && /(nowm|nowatermark)/i.test(args[0])) return void await Cli.sendVideo(from, Download.nowm as string, { quoted: id, caption: Text})
	if (Download && /(wm|watermark)/i.test(args[0])) return void await Cli.sendVideo(from, ((Download as ITTDownloader).wm || (Download as IMussically).mp4) as string,  { quoted: id, caption: Text})
	if (Download && /(musik|music)/i.test(args[0])) return void await Cli.sendVideo(from, (Download as ITTDownloader).audio as string, { quoted: id, caption: Text })
	if (Download) return void await Cli.sendVideo(from, Download.nowm || ((Download as ITTDownloader).wm || (Download as IMussically).mp4) as string, { quoted: id, caption: Text})
	return void await Cli.reply(from, `*「❗」* Mohon maaf kak fitur downloader saat ini sedang error harap coba lagi lain waktu`, id)
}, { command: ["ttdl", "tiktokdownloader", "tiktok", "tt"], tag: "downloader", event: ["tiktok <url tiktok>"], isUrl: true})