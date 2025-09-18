// 手动添加的事件数据
var signal_rev=0;
const manualEvents = [{
		id: "spring-match",
		type: "match",
		date: "2025-03-01",
		title: "3月1日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+5.3", "-19.6", "+73.7", "-59.4"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-03-15",
		title: "3月15日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+53.6", "+12.1", "-54.6", "-11.1"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-03-22",
		title: "3月22日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Koihs", "多元外卷人", "Xiaobukeai"],
		pointChanges: ["+63.0", "-20.9", "+6.0", "-48.1"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-03-29",
		title: "3月29日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+15.6", "+63.0", "-28.1", "-50.5"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-05",
		title: "4月5日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-24.3", "+15.6", "-60.3", "+69.0"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-12",
		title: "4月12日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-18.6", "+5.7", "+66.6", "-53.7"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-12",
		title: "4月12日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+11.4", "+76.9", "-22.7", "-65.6"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-19",
		title: "4月19日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-40.4", "+51.9", "+6.5", "-18.0"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-19",
		title: "4月19日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+6.3", "-58.1", "+81.0", "-29.2"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-19",
		title: "4月19日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+73.1", "+14.9", "-71.9", "-16.1"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-27",
		title: "4月27日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+5.2", "-56.1", "-19.3", "+70.2"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-04-27",
		title: "4月27日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+58.7", "-61.7", "+14.5", "-11.5"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-01",
		title: "5月1日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["Koihs", "Haraki", "多元外卷人", "Xiaobukeai"],
		pointChanges: ["+1.4", "-28.1", "-55.0", "+81.7"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-01",
		title: "5月1日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["Koihs", "Haraki", "多元外卷人", "Xiaobukeai"],
		pointChanges: ["-28.4", "+87.9", "+9.3", "-68.8"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-08",
		title: "5月8日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-27.3", "+2.7", "-55.0", "+79.6"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-17",
		title: "5月17日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-22.1", "-60.6", "+82.0", "+0.7"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-17",
		title: "5月17日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-18.3", "+64.6", "-55.6", "+9.3"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-22",
		title: "5月22日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-53.4", "+69.3", "+7.5", "-23.4"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-31",
		title: "5月31日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["-61.9", "+8.5", "+83.8", "-30.4"],
		icon: "fa-trophy"
	},
	{
		id: "spring-match",
		type: "match",
		date: "2025-05-31",
		title: "5月31日比赛",
		description: "精彩对局，4位选手参与",
		participants: ["2yrold", "Haraki", "Dawn", "Xiaobukeai"],
		pointChanges: ["+17.2", "-22.6", "+59.6", "-54.2"],
		icon: "fa-trophy"
	},
	{
		id: "club-formation",
		type: "club",
		date: "2025-03-15",
		title: "联盟正式取名为TanYauLEAGUE, 并由成员们共同设计了图标",
		description: "TanYauLEAGUE正式成立。",
		icon: "fa-users"
	},
	{
		id: "spring-season",
		type: "season",
		date: "2025-03-01",
		title: "2025年春季赛开始",
		description: "TanYauLEAGUE首个正式赛季——2025年春季赛正式开始，为期三个月共20场比赛，并由成员Dawn初步记录对局结果。",
		icon: "fa-flag"
	},
	{
		id: "spring-playoffs",
		type: "season",
		date: "2025-06-09",
		title: "2025年春季赛季后赛开始",
		description: "春季赛季后赛正式开始，为期一夜共3个半庄，从该赛季开始正式记录对局明细并统计个人数据。",
		icon: "fa-flag"
	},
	{
		id: "fall-season",
		type: "season",
		date: "2025-09-20",
		title: "2025年秋季赛开始",
		description: "TanYauLEAGUE2025年秋季赛正式开始，为期16周共120人次参与比赛。",
		icon: "fa-flag"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-03-17",
		title: "新成员加入",
		description: "欢迎新成员多元外卷人加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "web-formation",
		type: "club",
		date: "2025-03-19",
		title: "TanYauLEAGUE官网",
		description: "TanYauLEAGUE官网由成员Haraki编写最初版本，并且后续由成员2yrold负责维护。",
		icon: "fa-users"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-03-19",
		title: "新成员加入",
		description: "欢迎新成员Koihs加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-05-22",
		title: "新成员加入",
		description: "欢迎新成员zhunzhun加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-08-23",
		title: "新成员加入",
		description: "欢迎新成员tooru加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-08-23",
		title: "新成员加入",
		description: "欢迎新成员cos_squared加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "new-member",
		type: "club",
		date: "2025-08-29",
		title: "新成员加入",
		description: "欢迎新成员Feat加入TanYauLEAGUE！",
		icon: "fa-user-plus"
	},
	{
		id: "club-formation",
		type: "club",
		date: "2025-3-01",
		title: "联盟成立",
		description: "联盟由最初四位雀士成立：2yrold, Haraki, Xiaobukeai, Dawn。",
		icon: "fa-users"
	}
];

// 全局事件数组
let events = [...manualEvents];
const CACHE_KEY = "tanyau_events_cache";
const CACHE_EXPIRY = 10 * 60 * 1000; // 10分钟缓存
// 显示加载状态
function showLoading() {
	document.getElementById('loadingContainer').style.display = 'flex';
}
// 隐藏加载状态
function hideLoading() {
	document.getElementById('loadingContainer').style.display = 'none';
}
// 更新进度条
function updateProgress(current, total) {
	const progress = Math.round((current / total) * 100);
	document.getElementById('progressBar').style.width = `${progress}%`;
	document.getElementById('loadedCount').textContent = current;
	document.getElementById('totalCount').textContent = total;
}
// 显示错误信息
function showError(message) {
	const errorElement = document.getElementById('errorMessage');
	document.getElementById('errorText').textContent = message;
	errorElement.style.display = 'block';
	document.getElementById('refreshCacheBtn').style.display = 'block';
}
// 隐藏错误信息
function hideError() {
	document.getElementById('errorMessage').style.display = 'none';
}
// 从GitHub加载比赛数据（带缓存） - 适配新数据结构
async function loadMatchEvents() {
	showLoading();
	hideError();
	// 尝试从缓存中获取数据
	const cachedData = localStorage.getItem(CACHE_KEY);
	const now = new Date().getTime();
	if (cachedData) {
		const {
			data,
			timestamp
		} = JSON.parse(cachedData);
		// 检查缓存是否过期
		if (now - timestamp < CACHE_EXPIRY) {
			console.log('使用缓存数据');
			document.getElementById('cacheInfo').style.display = 'block';
			events = [...manualEvents, ...data];
			renderEvents();
			hideLoading();
			return;
		}
	}
	console.log('从GitHub加载新数据');
	try {
		// 获取GitHub仓库中的AllData.json文件
		var matchList = JSON.parse((await getGitHubFile()).content);
		// 更新进度条 - 总数为比赛记录的数量
		const totalMatches = matchList.length;
		updateProgress(0, totalMatches);

		// 处理每个比赛记录
		const matchEvents = [];
		let processedCount = 0;

		for (const matchData of matchList) {
			// 从数据中提取最后一条player_info日志
			const playerInfoLog = [...matchData.logs].reverse().find(log => log.type === 'player_info');
			if (!playerInfoLog) continue;
			// 提取玩家信息
			const players = playerInfoLog.player.sort((a, b) => a.id - b.id);
			const participants = players.map(p => p.name);
			// 计算段位分变化（除以10）
			const pointChanges = players.map(p => {
				const change = p.point / 10;
				return change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
			});
			// 创建比赛事件
			const matchDate = new Date(matchData.time);
			const formattedDate =
				`${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
			matchEvents.push({
				type: "match",
				date: formattedDate,
				title: `${matchDate.getMonth() + 1}月${matchDate.getDate()}日比赛`,
				description: `精彩对局，${participants.length}位选手参与`,
				participants: participants,
				pointChanges: pointChanges,
				matchId: matchData.time.toString(),
				icon: "fa-trophy"
			});
			// 更新进度
			processedCount++;
			updateProgress(processedCount, totalMatches);
		}
		// 更新事件数组
		events = [...manualEvents, ...matchEvents];
		// 保存到缓存
		localStorage.setItem(CACHE_KEY, JSON.stringify({
			data: matchEvents,
			timestamp: now
		}));
		// 渲染事件
		renderEvents();
	} catch (error) {
		console.error('从GitHub加载数据失败:', error);
		showError('数据加载失败: ' + error.message);
	} finally {
		// 确保隐藏加载状态
		setTimeout(hideLoading, 500);
	}
}

// 渲染事件卡片
function renderEvents(filter = "all") {
	const timeline = document.getElementById('timeline');
	timeline.innerHTML = '';

	// 筛选事件
	let filteredEvents = events;
	if (filter !== "all") {
		filteredEvents = events.filter(event => event.type === filter);
	}

	// 按日期排序（从新到旧）
	filteredEvents.sort((a, b) => {
		// 先比较日期
		const dateCompare = new Date(b.date) - new Date(a.date);
		if (dateCompare !== 0) return dateCompare;

		// 如果日期相同，比较时间戳（优先使用文件名中的时间戳）
		const timestampA = a.matchId ? parseInt(a.matchId) : 0;
		const timestampB = b.matchId ? parseInt(b.matchId) : 0;

		return timestampB - timestampA; // 降序排序（最新的在前）
	});

	// 渲染事件
	filteredEvents.forEach((event, index) => {
		const eventDate = new Date(event.date);
		const formattedDate = `${eventDate.getFullYear()}年${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;

		const card = document.createElement('div');
		card.className = `event-card ${event.type} ${index % 2 === 0 ? 'left' : 'right'}`;
		card.dataset.id = event.id;

		// 事件卡片内容
		let cardContent = `
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-icon"><i class="fas ${event.icon}"></i></div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-desc">${event.description}</p>
                `;

		// 比赛事件卡片 - 添加参与者和结果
		if (event.type === "match") {
			cardContent += `
                        <div class="participants">
                            ${event.participants.map(p => `<span class="participant">${p}</span>`).join('')}
                        </div>
                        <div class="results">
                            ${event.participants.map((p, i) => `
                                <div class="result">
                                    <div>${p}</div>
                                    <div class="${parseFloat(event.pointChanges[i]) > 0 ? 'positive' : 'negative'}">
                                        ${event.pointChanges[i]}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;

			// 添加点击事件
			if (event.matchId) {
				card.addEventListener('click', () => {
					window.location.href = `match_detail.html?matchId=${event.matchId}`;
				});
			}
		}

		card.innerHTML = cardContent;
		timeline.appendChild(card);
	});

	// 如果没有事件
	if (filteredEvents.length === 0) {
		timeline.innerHTML = `
                    <div class="loading" style="padding: 50px; background: rgba(0,0,0,0.2); border-radius: 15px;">
                        <i class="fas fa-info-circle" style="animation: none; color: #4cc9f0;"></i>
                        <p>没有找到相关事件</p>
                    </div>
                `;
	}
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
	// 从GitHub加载比赛数据
	loadMatchEvents();

	// 筛选按钮事件
	document.querySelectorAll('.filter-btn').forEach(button => {
		button.addEventListener('click', function() {
			// 更新活动按钮状态
			if (button.id != "sortBtn") {
				document.querySelectorAll('.filter-btn').forEach(btn => {
					btn.classList.remove('active');
				});
				this.classList.add('active');
			}


			// 获取筛选类型
			const filter = this.dataset.filter;
			renderEvents(filter);
		});
	});

	// 排序按钮事件
	document.getElementById('sortBtn').addEventListener('click', function() {
		this.classList.toggle('active');
		const timeline = document.getElementById('timeline');
		const cards = Array.from(timeline.children);
		signal_rev=1-signal_rev;
		if(signal_rev)cards.reverse().forEach(card => timeline.appendChild(card));
		else cards.forEach(card => timeline.appendChild(card));
		
	});

	// 刷新缓存按钮
	document.getElementById('refreshCacheBtn').addEventListener('click', function() {
		localStorage.removeItem(CACHE_KEY);
		loadMatchEvents();
	});
});;
(function() {
	const TEXTS = [];
	const TEXT_COLORS = [];
	const container = document.createElement('div');
	container.id = 'clickEffectContainer';
	container.style.cssText = `
        position: fixed; top: 0; left: 0; 
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
	document.body.appendChild(container);
	const EXCLUDE_SELECTORS = [
		'button', 'a', 'input', 'select', 'textarea',
		'[onclick]', '.nav-item', '.menu-btn'
	];
	document.addEventListener('click', (e) => {
		if (!EXCLUDE_SELECTORS.some(sel => e.target.closest(sel))) {
			createTextEffect(e.clientX, e.clientY);
			createPeachBlossomEffect(e.clientX, e.clientY);
			window.clickCount = (window.clickCount || 0) + 1;
		}
	}, true);

	function createTextEffect(x, y) {
		const effect = document.createElement('div');
		effect.style.cssText = `
            position: absolute;
            left: ${x}px; top: ${y}px;
            font: bold 18px 楷体, KaiTi;
            color: ${TEXT_COLORS[window.clickCount % TEXT_COLORS.length]};
            pointer-events: none;
            user-select: none;
            animation: float 2s forwards;
            text-shadow: 0 0 5px rgba(255,255,255,0.7);
            z-index: 10000;
        `;
		effect.textContent = TEXTS[window.clickCount % TEXTS.length];
		container.appendChild(effect);
		setTimeout(() => effect.remove(), 2000);
	}

	function createPeachBlossomEffect(x, y) {
		const petalCount = 15;
		const duration = 3000;
		const petalSVG = encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#FFEEF7" d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8M8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8M12,11C13.1,11 14,11.9 14,13C14,14.1 13.1,15 12,15C10.9,15 10,14.1 10,13C10,11.9 10.9,11 12,11M19,17V19H5V17C5,14.8 8.1,13 12,13C15.9,13 19,14.8 19,17Z"/>
                <path fill="#FFD6EB" d="M12,4C11.4,4 11,4.4 11,5C11,5.6 11.4,6 12,6C12.6,6 13,5.6 13,5C13,4.4 12.6,4 12,4Z"/>
            </svg>
        `);
		for (let i = 0; i < petalCount; i++) {
			const petal = document.createElement('div');
			const size = 15 + Math.random() * 10;
			const rotation = Math.random() * 360;
			const delay = Math.random() * 500;
			petal.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: url('data:image/svg+xml;utf8,${petalSVG}');
                background-size: contain;
                pointer-events: none;
                z-index: 9998;
                opacity: 0.9;
                transform: rotate(${rotation}deg);
                animation: petal-fall ${duration}ms ease-out ${delay}ms forwards;
                filter: drop-shadow(0 0 2px rgba(255,200,230,0.7));
            `;
			container.appendChild(petal);
			const angle = Math.random() * Math.PI * 2;
			const distance = 50 + Math.random() * 100;
			const endX = x + Math.cos(angle) * distance;
			const endY = y + Math.sin(angle) * distance + 100;
			const keyframes = `
                @keyframes petal-fall-${i} {
                    0% { 
                        transform: translate(0, 0) rotate(${rotation}deg); 
                        opacity: 0.9;
                    }
                    100% { 
                        transform: translate(${endX - x}px, ${endY - y}px) rotate(${rotation + 180}deg);
                        opacity: 0;
                    }
                }
            `;
			const style = document.createElement('style');
			style.textContent = keyframes;
			document.head.appendChild(style);
			petal.style.animationName = `petal-fall-${i}`;
			setTimeout(() => petal.remove(), duration + delay);
		}
	}
	const style = document.createElement('style');
	style.textContent = `
        @keyframes float {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100px); opacity: 0; }
        }
    `;
	document.head.appendChild(style);
})();
