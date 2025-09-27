const all_pages = document.querySelectorAll("body>ol>li")
var score = [0, 25000, 25000, 25000, 25000];
var round = 1,
	honnba = 0,
	kyoutaku = 0;
var chrome_used = 0;
var nowoya = 1;
var elem_honnba = document.getElementById("honnba"),
	elem_kyoutaku = document.getElementById("kyoutaku");
var elem_player = document.querySelectorAll("#game .jicha,#game .shimocha,#game .toicha,#game .kamicha");
var reached = [0, 0, 0, 0, 0];
var tennpaied = [0, 0, 0, 0, 0];
var ryuumanned = [0, 0, 0, 0, 0];
var order = [0, 1, 2, 3, 4];
var elem_fans = document.querySelectorAll("#fan li");
var elem_fus = document.querySelectorAll("#fu li");
var selected_fan = -1,
	selected_fu = -1;
var oyaku = 0; //0 亲 1 子
var agaway = 0; //0 自摸 1荣和
var pAname = "",
	pBname = "";
var agarisha = 0,
	houchuusha = 0,
	houchuusha_idx = 0,
	fsA = 0,
	fsB = 0;
var json={};
const fusu = [0, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]; //符数
const upscore = [0, 0, 0, 0, 0, 8000, 12000, 16000, 24000, 32000, 64000, 96000, 128000, 160000, 192000]; //子家超5番荣和点数
const uma = {
	111: [50000, 10000, -10000, -30000],
	112: [50000, 10000, -20000, -20000],
	120: [50000, 0, 0, -30000],
	130: [50000, -10000, -10000, -10000],
	201: [30000, 30000, -10000, -30000],
	202: [30000, 30000, -20000, -20000],
	300: [16800, 16600, 16600, -30000],
	400: [5000, 5000, 5000, 5000]
} //马点
const batsu = [
	[0, 0],
	[+3000, -1000],
	[+1500, -1500],
	[+1000, -3000],
	[0, 0]
]; //不听罚符
const kazelist = ["東", "南", "西", "北"];

function wap(n) {
	for (let i = 0; i < all_pages.length; i++)
		if (i == n) all_pages[i].style.display = "block";
		else all_pages[i].style.display = "none";

	if (n == 1) {
		show_round();
		refresh_data();
	} else if (n == 2) {
		//计算分数
		let furui_score = [0, score[1], score[2], score[3], score[4]]; // 存储旧分数，接下来会计算新的得点（分供托+顺位）
		let rank = [0, 1, 1, 1, 1]; // 排名
		let s_rank = [0, 1, 1, 1, 1]; // 不重排名
		let cnt_1 = 0,
			cnt_2 = 0,
			cnt_3 = 0; //1位，2位，3位数量
		for (let i = 1; i <= 4; i++) {
			for (let j = 1; j <= 4; j++) {
				if (score[j] > score[i]) rank[i]++, s_rank[i]++;
			}
			if (rank[i] == 1) cnt_1++;
			if (rank[i] == 2) cnt_2++;
			if (rank[i] == 3) cnt_3++;
		}
		for (let i = 1; i <= 4; i++) {
			for (let j = 1; j < i; j++) {
				if (rank[j] == rank[i]) s_rank[i]++;
			}
		}
		//供托分配
		if (cnt_1 == 1 || cnt_1 == 2) {
			for (let i = 1; i <= 4; i++)
				if (rank[i] == 1) score[i] += parseInt(kyoutaku * 1000 / cnt_1);
		} else if (cnt_1 == 3) {
			let signal = 1;
			for (let i = 1; i <= 4; i++)
				if (rank[i] == 1) score[i] += Math.floor(kyoutaku / 3) * 1000; //先尽可能分整点1000	
			kyoutaku = kyoutaku % 3; //余下2000或1000供托
			for (let i = 1; i <= 4; i++)
				if (rank[i] == 1)
					if (signal == 1) signal = 0, score[i] += kyoutaku * 400;
					else score[i] += kyoutaku * 300;
		}
		kyoutaku = 0;

		//顺位点分配
		let temp_uma = uma[100 * cnt_1 + 10 * cnt_2 + cnt_3];
		for (let i = 1; i <= 4; i++) score[i] += temp_uma[s_rank[i] - 1];

		point = [0, 0, 0, 0, 0];
		for (let i = 1; i <= 4; i++) point[i] = parseInt((score[i] - 30000) / 100)
		//冒泡排序
		order = [0, 1, 2, 3, 4]; //order[i] 代表顺位 i 的选手
		for (let i = 1; i <= 4; i++)
			for (j = i + 1; j <= 4; j++)
				if (rank[order[j]] < rank[order[i]]) {
					let tem = order[i];
					order[i] = order[j];
					order[j] = tem;
				}
		for (let i = 1; i <= 4; i++) {
			document.querySelectorAll(".res .resi")[i - 1].innerText = rank[order[i]] + " 位 ";
			document.querySelectorAll(".res .resname")[i - 1].innerText = elem_player[order[i] - 1].querySelector(
				"input").value;
			document.querySelectorAll(".res .resscore")[i - 1].innerText = furui_score[order[i]];
			let pt = point[order[i]];
			let str = "";
			if (pt >= 0) str = "+" + Math.floor(pt / 10.0) + "." + pt % 10;
			else str = "▲" + Math.floor(-pt / 10.0) + "." + (-pt) % 10;
			document.querySelectorAll(".res .respoint")[i - 1].innerText = str;
		}
		for (let i = 1; i <= 4; i++) score[i] = furui_score[i];
		json={"type":"player_info","player":[]};
		for (let i = 1; i <= 4; i++) {
			json["player"].push({"id":i, "name":elem_player[i - 1].querySelector("input").value, "score":score[i],"rank":rank[i],"point":point[i]})
		}
		logx(json)
	}

}

function refresh_data() {
	if (round == 9) wap(2);
	nowoya = (round - 1) % 4 + 1;
	if (chrome_used == 1) {
		document.querySelector(".planb").style.backgroundColor = "#1ac";
		document.querySelector(".planb").style.color = "#fff";
		document.querySelector(".naka").style.marginTop = "-20vh";
		document.querySelector(".next_round").style.marginTop = "-20vh";
		document.querySelector("#game .kamicha").style.marginTop = "-21vh";
		document.querySelector("#game .shimocha").style.marginTop = "-21vh";
		document.querySelector("#game .jicha").style.marginBottom = "10vh";
	} else {
		document.querySelector(".planb").style.backgroundColor = "#fff";
		document.querySelector(".planb").style.color = "#2e4058";
		document.querySelector(".naka").style.marginTop = "-15vh";
		document.querySelector(".next_round").style.marginTop = "-15vh";
		document.querySelector("#game .kamicha").style.marginTop = "-16vh";
		document.querySelector("#game .shimocha").style.marginTop = "-16vh";
		document.querySelector("#game .jicha").style.marginBottom = "0";
	}

	for (let i = 1; i <= 4; i++) {
		if (reached[i]) {
			elem_player[i - 1].querySelector(".reach").innerText = "●";
			elem_player[i - 1].querySelector(".reach").style.color = "#bc3636";
		} else {
			elem_player[i - 1].querySelector(".reach").innerText = "立直";
			elem_player[i - 1].querySelector(".reach").style.color = "#2e4058";
		}
	}

	let kaze = "东 ";
	if (round > 4) kaze = "南 ";
	elem_honnba.innerText = kaze + ((round - 1) % 4 + 1) + " 局 " + honnba + " 本场";
	elem_kyoutaku.innerText = "立直棒 " + kyoutaku;
	for (let i = 1; i <= 4; i++) elem_player[i - 1].querySelector("h1").innerText = score[i];
	for (let i = 1; i <= 4; i++) {
		elem_player[i - 1].querySelector(".kaze").innerText = kazelist[(i - nowoya + 8) % 4];
		if((i - nowoya + 8) % 4==0)elem_player[i - 1].querySelector(".kaze").style.color="#fdc620";
		else elem_player[i - 1].querySelector(".kaze").style.color="#eee";
	}

	let elem_pB = document.querySelectorAll(".playerB");
	for (let i = 1; i <= 3; i++) {
		if (i == houchuusha_idx) {
			elem_pB[i - 1].style.backgroundColor = "#37b";
			elem_pB[i - 1].style.color = "#fff";
		} else {
			elem_pB[i - 1].style.backgroundColor = "#fff";
			elem_pB[i - 1].style.color = "#2e4058";
		}
	}

	for (let i = 1; i <= 4; i++) {
		if (tennpaied[i] == 1) {
			document.querySelectorAll(".ryk button.kas")[i - 1].innerText = "听牌";
			document.querySelectorAll(".ryk button.kas")[i - 1].style.backgroundColor = "#4d8d2e";
			document.querySelectorAll(".ryk button.kas")[i - 1].style.color = "#fff";
		} else {
			document.querySelectorAll(".ryk button.kas")[i - 1].innerText = "未听";
			document.querySelectorAll(".ryk button.kas")[i - 1].style.backgroundColor = "#fff";
			document.querySelectorAll(".ryk button.kas")[i - 1].style.color = "#2e4058";
		}
		if (ryuumanned[i] == 1) {
			document.querySelectorAll(".ryk button.tas")[i - 1].style.backgroundColor = "#6f33a3";
			document.querySelectorAll(".ryk button.tas")[i - 1].style.color = "#fff";
		} else {
			document.querySelectorAll(".ryk button.tas")[i - 1].style.backgroundColor = "#fff";
			document.querySelectorAll(".ryk button.tas")[i - 1].style.color = "#2e4058";
		}
	}


	document.querySelector("#playerA").innerText = pAname;
	for (let i = 1; i <= 3; i++) {
		document.querySelectorAll(".playerB")[i - 1].style.display = "inline";
		document.querySelectorAll(".playerB")[i - 1].innerText = elem_player[(agarisha - 1 + i + 4) % 4].querySelector(
			"input").value;
	}
	document.querySelector("#oyaku").innerText = ((oyaku == 0) ? "（亲）" : "（子）");
	if (agaway == 0) {
		document.querySelector("#agariway").innerText = "自摸";
		for (let i = 1; i <= 3; i++) document.querySelectorAll(".playerB")[i - 1].style.display = "none";
	} else document.querySelector("#agariway").innerText = "荣和";

	for (let i = 1; i <= elem_fans.length; i++) {
		elem_fans[i - 1].style.backgroundColor = (i == selected_fan ? "#e40" : "#fff");
		elem_fans[i - 1].style.color = (i == selected_fan ? "#fff" : "#2e4058");
	}
	for (let i = 1; i <= elem_fus.length; i++) {
		elem_fus[i - 1].style.backgroundColor = (i == selected_fu ? "#71e" : "#fff");
		elem_fus[i - 1].style.color = (i == selected_fu ? "#fff" : "#2e4058");
	}
	if ((selected_fu != -1 && selected_fan != -1) || (selected_fan >= 5)) {
		// 点数计算
		let temp = 0;
		if (oyaku == 0 && agaway == 0) { //亲自摸
			if (selected_fan >= 5) temp = parseInt(upscore[selected_fan] / 2);
			else {
				temp = 2 * fusu[selected_fu] * 4 * (2 ** selected_fan);
				if (temp > 4000) temp = 4000;
				temp = Math.ceil(temp / 100) * 100;
			}
			temp += honnba * 100;
			document.getElementById("fscore").innerText = temp + " ALL";
			fsA = temp;
		} else if (oyaku == 1 && agaway == 0) { //子自摸
			if (selected_fan >= 5) temp = parseInt(upscore[selected_fan] / 4);
			else {
				temp = fusu[selected_fu] * 4 * (2 ** selected_fan);
				if (temp > 2000) temp = 2000;
			}
			fsA = temp;
			fsA = Math.ceil(fsA / 100) * 100;
			fsA += honnba * 100;
			fsB = temp * 2;
			fsB = Math.ceil(fsB / 100) * 100;
			fsB += honnba * 100;
			document.getElementById("fscore").innerText = (fsA) + " " + (fsB);

		} else if (oyaku == 0 && agaway == 1) { //亲荣和
			if (selected_fan >= 5) temp = parseInt(upscore[selected_fan] / 2 * 3);
			else {
				temp = 6 * fusu[selected_fu] * 4 * (2 ** selected_fan);
				if (temp > 12000) temp = 12000;
				temp = Math.ceil(temp / 100) * 100;
			}
			temp += honnba * 300;
			fsA = temp;
			document.getElementById("fscore").innerText = temp + "";
		} else if (oyaku == 1 && agaway == 1) { //子荣和
			if (selected_fan >= 5) temp = parseInt(upscore[selected_fan]);
			else {
				temp = 4 * fusu[selected_fu] * 4 * (2 ** selected_fan);
				if (temp > 8000) temp = 8000;
				temp = Math.ceil(temp / 100) * 100;
			}
			temp += honnba * 300;
			fsA = temp;
			document.getElementById("fscore").innerText = temp + "";
		}
	}
}

function show_round() {
	logx({"type":"round","round":round,"honnba":honnba,"kyoutaku":kyoutaku})
}

function reach(n) {
	if (!reached[n]) {
		score[n] -= 1000;
		kyoutaku++;
		logx({"type":"reach","player":n})
	} else {
		score[n] += 1000;
		kyoutaku--;
		for (let i = logs.length - 1; i >= 0; i--) {
			if (logs[i]["type"]=="reach" && logs[i]["player"]== n) {
				logs.splice(i, 1);
				break;
			}
		}
	}
	reached[n] = 1 - reached[n];
	refresh_data();
}

function fan(n) {
	selected_fan = n;
	refresh_data();
}

function fu(n) {
	selected_fu = n;
	refresh_data();
}

function modoru() {
	selected_fan = -1;
	selected_fu = -1;
	agarisha = 0;
	houchuusha = 0;
	houchuusha_idx = 0;
	kieru();
}

function tsumo(n) {
	agarisha = n;
	if (nowoya == n) {
		oyaku = 0;
	} else oyaku = 1;
	agaway = 0;
	pAname = elem_player[n - 1].querySelector("input").value;
	document.querySelector(".haiiro").style.display = "block";
	document.querySelector(".kessan").style.display = "block";
	document.querySelector(".kessan").style.rotate = (-(n - 1) * 90) + "deg";
	if (n % 2 == 0) {
		document.querySelector(".kessan").style.width = "76vh";
		document.querySelector(".kessan").style.height = "76vw";
		document.querySelector(".kessan").style.padding = "2vw 2vh";
	} else {
		document.querySelector(".kessan").style.width = "76vw";
		document.querySelector(".kessan").style.height = "76vh";
		document.querySelector(".kessan").style.padding = "2vh 2vw";
	}
	refresh_data();
}

function ron(n) {
	agarisha = n;
	if (nowoya == n) {
		oyaku = 0;
	} else oyaku = 1;
	agaway = 1;
	pAname = elem_player[n - 1].querySelector("input").value;
	document.querySelector(".haiiro").style.display = "block";
	document.querySelector(".kessan").style.display = "block";
	document.querySelector(".kessan").style.rotate = (-(n - 1) * 90) + "deg";
	if (n % 2 == 0) {
		document.querySelector(".kessan").style.width = "76vh";
		document.querySelector(".kessan").style.height = "76vw";
		document.querySelector(".kessan").style.padding = "2vw 2vh";
		for (let i = 1; i <= 3; i++) {
			document.querySelectorAll(".playerB")[i - 1].style.lineHeight = "7vh";
		}
	} else {
		document.querySelector(".kessan").style.width = "76vw";
		document.querySelector(".kessan").style.height = "76vh";
		document.querySelector(".kessan").style.padding = "2vh 2vw";
		for (let i = 1; i <= 3; i++) {
			document.querySelectorAll(".playerB")[i - 1].style.lineHeight = "0vh";
		}
	}
	refresh_data();
}

function submit() {
	document.querySelector(".haiiro").style.display = "none";
	document.querySelector(".kessan").style.display = "none";
	if (fsA <= 0) return;
	if (agaway == 1 && houchuusha == 0) return;
	if (oyaku == 0 && agaway == 0) { //亲自摸
		score[agarisha] += fsA * 3;
		json = {"type":"tsumo","score":{[agarisha]:fsA*3}}
		for (let i = 1; i <= 4; i++) {
			if (i != agarisha) {
				score[i] -= fsA;
				json["score"][i]=-fsA;
			}
		}
		logx(json)
	} else if (oyaku == 1 && agaway == 0) { //子自摸
		score[agarisha] += fsA * 2 + fsB;
		json = {"type":"tsumo","score":{[agarisha]:(fsA*2+fsB)}}
		for (let i = 1; i <= 4; i++) {
			if (i != agarisha && i != nowoya) {
				score[i] -= fsA;;
				json["score"][i]=-fsA;
			} else if (i == nowoya) {
				score[i] -= fsB;
				json["score"][i]=-fsB;
			}
		}
		logx(json)
	} else if (oyaku == 0 && agaway == 1) { //亲荣和
		score[agarisha] += fsA;
		score[houchuusha] -= fsA;
		logx({"type":"ron","score":{[agarisha]:fsA,[houchuusha]:-fsA}})
	} else if (oyaku == 1 && agaway == 1) { //子荣和
		score[agarisha] += fsA;
		score[houchuusha] -= fsA;
		logx({"type":"ron","score":{[agarisha]:fsA,[houchuusha]:-fsA}})
	}
	//交立直棒
	score[agarisha] += kyoutaku * 1000;
	if (kyoutaku != 0) logx({"type":"agari_kyoutaku","player":agarisha,"score":kyoutaku*1000})
	kyoutaku = 0;
	for (let i = 1; i <= 4; i++) {
		reached[i] = 0;
		elem_player[i - 1].querySelector(".reach").innerText = "立直";
		elem_player[i - 1].querySelector(".reach").style.color = "black";
	}

	document.querySelector(".next_round").style.display = "block";
	refresh_data();
	fsA = 0;
	fsB = 0;
	houchuusha = 0;
	selected_fan = 0;
	selected_fu = 0;
	houchuusha_idx = 0;
}

function tsuki(n) {
	if (n == 0) {
		if (agarisha == nowoya) {
			honnba++;
		} else {
			honnba = 0;
			round++;
		}
	} else if (n == 1) {
		//荒牌流局
		honnba++;
		if (tennpaied[nowoya] != 1) round++;
		json = {"type":"howannpai_ryuukyoku","score":{}};
		//不听罚符
		let tp_cnt = 0;
		for (let i = 1; i <= 4; i++)
			if (tennpaied[i]) tp_cnt++;

		for (let i = 1; i <= 4; i++) {
			if (tennpaied[i]) score[i] += batsu[tp_cnt][0], json["score"][i]=batsu[tp_cnt][0];
			else score[i] += batsu[tp_cnt][1], json["score"][i]=batsu[tp_cnt][1];
		}
		logx(json);
		//流局满贯
		for (let i = 1; i <= 4; i++) {
			if (ryuumanned[i]) {
				json={"type":"ryuumann","score":{}}
				if (i == nowoya) {
					score[i] += 12000;
					json["score"][i]=12000;
					for (let j = 1; j <= 4; j++) {
						if (i != j) score[j] -= 4000, json["score"][i]=-4000;
					}
				} else {
					score[i] += 8000;
					json["score"][i]=8000;
					for (let j = 1; j <= 4; j++) {
						if (i != j && nowoya != j) score[j] -= 2000, json["score"][i]=-2000;
						else if (j == nowoya) score[j] -= 4000, json["score"][i]=-4000;
					}
				}
				logx(json);
			}
		}
	} else if (n == 2) {
		logx({"type":"chuuto_ryuukyoku"});
		honnba++;
	} else {
		return;
	}
	kieru();
	show_round();
	agarisha = 0, houchuusha = 0;
	tennpaied = [0, 0, 0, 0, 0];
	ryuumanned = [0, 0, 0, 0, 0];
	reached = [0, 0, 0, 0, 0];
	refresh_data();
}

function ryuukyoku() {
	document.querySelector(".haiiro").style.display = "block";
	document.querySelector(".ryk").style.display = "block";
}

function tennpai(n) {
	tennpaied[n] = 1 - tennpaied[n];
	refresh_data();
}

function ryuumann(n) {
	ryuumanned[n] = 1 - ryuumanned[n];
	refresh_data();
}

function houchuu(n) {
	houchuusha_idx = n;
	houchuusha = (agarisha - 1 + n + 4) % 4 + 1;
	refresh_data();
}
var elem_cr = document.querySelectorAll(".correction input");

function shuusei() {
	document.querySelector(".correction").style.display = "block";
	elem_cr[0].value = round, elem_cr[1].value = honnba, elem_cr[2].value = kyoutaku;
	for (let i = 0; i < 4; i++) {
		elem_cr[3 + i].value = score[i + 1];
		document.querySelectorAll(".correction span")[i].innerText = elem_player[i].querySelector("input").value;
	}
	calc();
}

function correct() {
	round = parseInt(elem_cr[0].value);
	honnba = parseInt(elem_cr[1].value);
	kyoutaku = parseInt(elem_cr[2].value);
	json={"type":"correct","round":round,"honnba":honnba,"kyoutaku":kyoutaku,"score":{}};
	for (let i = 0; i < 4; i++) {
		score[i + 1] = parseInt(elem_cr[3 + i].value);
		json["score"][(i+1)]=score[i+1];
	}
	logx(json);
	kieru();
	refresh_data();
}

function kieru() {
	//各种窗口全部消失
	document.querySelector(".next_round").style.display = "none";
	document.querySelector(".haiiro").style.display = "none";
	document.querySelector(".kessan").style.display = "none";
	document.querySelector(".ryk").style.display = "none";
	document.querySelector(".correction").style.display = "none";
}
kieru();
wap(0);

//监听修正文本，然后计算
for (let i = 0; i < 7; i++) document.querySelectorAll(".correction input")[i].oninput = calc;

function calc() {
	let ans = 0;
	ans += parseInt(document.querySelectorAll(".correction input")[2].value) * 1000;
	for (let i = 0; i < 4; i++) ans += parseInt(document.querySelectorAll(".correction input")[3 + i].value);
	document.querySelectorAll(".correction span")[4].innerText = ans;
}

//平板 chrome 特攻
function chr() {
	chrome_used = 1 - chrome_used;
	refresh_data();
}

//日志记录，输出部分
var logs = [];

function logx(s) {
	console.log(s);
	logs.push(s);
}

function data_out() {
	download("TanyauData" + Date.now() + ".json", JSON.stringify({"time":Date.now(),"logs":logs}));
}

function upload(){
	writein({"time":Date.now(),"logs":logs});
}

function new_game() {
	score = [0, 25000, 25000, 25000, 25000];
	kyoutaku = 0, round = 1, honnba = 0, nowoya = order[1];
	reached = [0, 0, 0, 0, 0];
	selected_fan = -1, selected_fu = -1, oyaku = 0, agaway = 0, pAname = "", pBname = "";
	agarisha = 0, houchuusha = 0, houchuusha_idx = 0, fsA = 0, fsB = 0;
	tennpaied = [0, 0, 0, 0, 0];
	ryuumanned = [0, 0, 0, 0, 0];
	logs=[];
	wap(1);

}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
// safari 特攻
window.onload = function() {
	document.addEventListener('touchstart', function(event) {
		if (event.touches.length > 1) {
			event.preventDefault();
		}
	});
	var lastTouchEnd = 0;
	document.addEventListener('touchend', function(event) {
		var now = (new Date()).getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);
	document.addEventListener('gesturestart', function(event) {
		event.preventDefault();
	});
}
