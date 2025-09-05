// 玩家数据结构定义
class Player {
	constructor(name, point, highScore, avoidanceRate) {
		this.name = name;
		this.point = point;
		this.highScore = highScore;
		this.avoidanceRate = avoidanceRate;
	}
}

// 玩家数据库
const playerDatabase = [
	new Player("2yrold", 0, 0, 0),
	new Player("Haraki", 0, 0, 0),
	new Player("多元外卷人", 0, 0, 0),
	new Player("Dawn", 0, 0, 0),
	new Player("Koihs", 0, 0, 0),
	new Player("Xiaobukeai", 0, 0, 0),
	new Player("zhunzhun", 0, 0, 0),
	new Player("cos_squared", 0, 0, 0),
    new Player("tooru", 0, 0, 0),
	new Player("Feat", 0, 0, 0)
];


// 玩家数据操作接口
const PlayerManager = {
	// 获取所有玩家数据
	getAllPlayers: function () {
		return [...playerDatabase];
	},

	// 按名称查找玩家
	getPlayerByName: function (name) {
		return playerDatabase.find(player => player.name === name);
	},

	// 更新玩家数据
	updatePlayer: function (name, data) {
		const player = this.getPlayerByName(name);
		if (player) {
			Object.assign(player, data);
			return true;
		}
		return false;
	},

	// 添加新玩家
	addPlayer: function (name, point = 0, highScore = 0, avoidanceRate = 0) {
		if (!this.getPlayerByName(name)) {
			playerDatabase.push(new Player(name, point, highScore, avoidanceRate));
			return true;
		}
		return false;
	},

	// 删除玩家
	removePlayer: function (name) {
		const index = playerDatabase.findIndex(p => p.name === name);
		if (index !== -1) {
			playerDatabase.splice(index, 1);
			return true;
		}
		return false;
	},

	// 按积分排序
	sortByPoints: function () {
		return [...playerDatabase].sort((a, b) => b.point - a.point);
	},

	// 按最高分排序
	sortByHighScore: function () {
		return [...playerDatabase].sort((a, b) => b.highScore - a.highScore);
	},

	// 按回避率排序
	sortByAvoidanceRate: function () {
		return [...playerDatabase].sort((a, b) => b.avoidanceRate - a.avoidanceRate);
	}
};

// 排行榜渲染器
const RankRenderer = {
	// 生成单个玩家项的HTML
	_generatePlayerHTML: function (player, rank, criteria) {
		const isFirst = rank === 0;
		const bgColor = isFirst ? "#3b863e" : "#ffffff";
		const textColor = isFirst ? "white" : "black";
		const fontWeight = rank >= 3 ? "400" : "normal";

		// 根据标准格式化值
		let value;
		if (criteria === 'point') {
			value = (player.point >= 0 ? "+" : "") + player.point.toFixed(1);
		} else if (criteria === 'highScore') {
			value = player.highScore.toLocaleString();
		} else {
			value = player.avoidanceRate.toFixed(3);
		}

		return `
            <li style="background-color: ${bgColor}">
                <ol>
                    <li>
                        <svg width="24px" height="40px" style="vertical-align: middle;position: relative">
                            <circle cx="12" cy="16" r="12" fill="white" />
                            <text x="12" y="22" font-family="Times New Roman" font-size="16"
                                text-anchor="middle" fill="${isFirst ? "#3b863e" : "black"}" 
                                ${rank >= 3 ? 'style="font-weight:400"' : ''}>${rank + 1}
                            </text>
                        </svg>
                        <p style="display:inline; color:${textColor}; ${rank >= 3 ? 'font-weight:400;' : ''}">
                            ${player.name}
                        </p>
                        <span style="display:inline; color:${textColor}">${value}</span>
                    </li>
                </ol>
            </li>`;
	},

	// 渲染单个排行榜
	renderRanking: function (containerId, players, criteria) {
		const container = document.getElementById(containerId);
		if (!container) return;

		container.innerHTML = players.map((player, index) =>
			this._generatePlayerHTML(player, index, criteria)
		).join("");
	},

	// 渲染所有排行榜
	renderAllRankings: function () {
		this.renderRanking('pointRanking', PlayerManager.sortByPoints(), 'point');
		this.renderRanking('highScoreRanking', PlayerManager.sortByHighScore(), 'highScore');
		this.renderRanking('avoidanceRanking', PlayerManager.sortByAvoidanceRate(), 'avoidanceRate');
	}
};

// 页面加载时初始化排行榜
document.addEventListener('DOMContentLoaded', function () {
	RankRenderer.renderAllRankings();
});

// 从GitHub获取并处理对局数据
async function updatePlayerData() {
	try {
		// 直接获取AllData.json文件
		const allMatches = JSON.parse((await getGitHubFile()).content);
		// 处理每场对局
		for (const match of allMatches) {
			try {
				// 使用match.time进行日期过滤（2025年9月1日之后）
				const matchDate = new Date(match.time);
				if (matchDate < new Date(2025, 8, 1)) continue;

				// 查找终局玩家信息
				const playerInfo = match.logs.find(log => log.type === 'player_info');
				if (!playerInfo || !playerInfo.player) continue;

				// 更新每个玩家的统计数据
				playerInfo.player.forEach(player => {
					// 在playerDatabase中查找玩家
					const dbPlayer = PlayerManager.getPlayerByName(player.name);
					if (!dbPlayer) return;

					// 更新段位分（累加）
					PlayerManager.updatePlayer(player.name, {
						point: dbPlayer.point + (player.point / 10)
					});

					// 更新最高得点
					if (player.score > dbPlayer.highScore) {
						PlayerManager.updatePlayer(player.name, {
							highScore: player.score
						});
					}

					// 更新避四率相关统计（使用PlayerManager更新）
					if (!dbPlayer._stats) {
						PlayerManager.updatePlayer(player.name, {
							_stats: {
								totalGames: 0,
								fourthPlace: 0
							}
						});
					}

					// 更新统计
					const newStats = {
						...dbPlayer._stats
					};
					newStats.totalGames++;
					if (player.rank === 4) newStats.fourthPlace++;

					PlayerManager.updatePlayer(player.name, {
						_stats: newStats
					});
				});
			} catch (matchError) {
				console.error(`处理比赛 ${match.time} 时出错:`, matchError);
			}
		}

		// 计算避四率并清理临时数据
		playerDatabase.forEach(player => {
			if (player._stats) {
				PlayerManager.updatePlayer(player.name, {
					avoidanceRate: (player._stats.totalGames - player._stats.fourthPlace) / player
						._stats.totalGames,
					_stats: undefined // 清理临时数据
				});
			}
		});

		console.log('玩家数据更新完成');
		console.log('更新后的玩家数据库:', playerDatabase);

		// 关键修复：数据更新后重新渲染排行榜
		RankRenderer.renderAllRankings();
	} catch (error) {
		console.error('数据更新失败:', error);
	}
}

// 页面加载时自动更新数据
window.addEventListener('DOMContentLoaded', function () {
	// 先渲染一次初始排行榜（显示0数据）
	RankRenderer.renderAllRankings();

	// 然后开始更新数据，更新完成后会自动重新渲染
	updatePlayerData();
});

;
(function () {
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

const directory = document.querySelectorAll('.target-fix');
const links = document.querySelectorAll('.top a');
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropbtn = document.querySelector('.dropbtn');
window.addEventListener('scroll', function () {
	let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	let ed = -1;
	links.forEach(link => link.classList.remove("selected"));
	dropbtn.classList.remove("selected");
	for (let i = 0; i < directory.length; i++) {
		if (directory[i].offsetTop <= scrollTop + 10) {
			ed = i;
		}
	}
	if (ed !== -1) {
		links[ed].classList.add("selected");
		const selectedLink = links[ed];
		const isDropdownItem = Array.from(dropdownLinks).includes(selectedLink);
		if (isDropdownItem) {
			dropbtn.classList.add("selected");
		}
	}
});
window.onresize = () => {
	if (window.innerWidth < 686) document.querySelector('.top ul').style.display = "none";
	else document.querySelector('.top ul').style.display = "block";
}
