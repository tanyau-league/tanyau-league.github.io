const seasonDatabase = {};

// 页面加载时从HTML提取数据
document.addEventListener('DOMContentLoaded', function() {
	// 从HTML收集赛季数据
	document.querySelectorAll('#season-data .season').forEach(seasonEl => {
		const seasonId = seasonEl.dataset.id;

		seasonDatabase[seasonId] = {
			seasonName: seasonEl.dataset.name,
			startDate: seasonEl.dataset.start,
			endDate: seasonEl.dataset.end,
			playersCount: seasonEl.dataset.players,
			players: [],
			awards: {}
		};

		// 收集选手数据
		seasonEl.querySelectorAll('.player').forEach(playerEl => {
			seasonDatabase[seasonId].players.push({
				name: playerEl.dataset.name,
				point: parseFloat(playerEl.dataset.point),
				highScore: parseInt(playerEl.dataset.highscore),
				avoidanceRate: parseFloat(playerEl.dataset.avoidancerate)
			});
		});

		// 收集奖项数据
		seasonEl.querySelectorAll('.award').forEach(awardEl => {
			const awardType = awardEl.dataset.type;
			seasonDatabase[seasonId].awards[awardType] = {
				name: awardEl.dataset.name,
				avatar: awardEl.dataset.avatar,
				ranking: awardEl.dataset.ranking,
				point: awardEl.dataset.point,
				highScore: awardEl.dataset.highscore,
				avoidanceRate: awardEl.dataset.avoidancerate,
				attendance: awardEl.dataset.attendance
			};
		});
	});

	// 设置最新赛季ID
	const latestSeasonId = Object.keys(seasonDatabase)[0];
	const latestSeason = seasonDatabase[latestSeasonId];

	// 渲染所有赛季的奖项
	renderAllSeasons();

	// 更新底部日期
	document.getElementById('update-date').textContent =
		new Date().toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
});

// 重构的排行榜渲染器
const RankRenderer = {
	_generatePlayerHTML: function(player, rank, criteria) {
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

	renderRanking: function(selector, players, criteria) {
		const containers = document.querySelectorAll(selector);
		if (!containers.length) return;

		// 对所有容器应用相同的排行榜
		containers.forEach(container => {
			let sortedPlayers = [...players];

			if (criteria === 'point') {
				sortedPlayers.sort((a, b) => b.point - a.point);
			} else if (criteria === 'highScore') {
				sortedPlayers.sort((a, b) => b.highScore - a.highScore);
			} else if (criteria === 'avoidanceRate') {
				sortedPlayers.sort((a, b) => b.avoidanceRate - a.avoidanceRate);
			}
			container.innerHTML = sortedPlayers.map((player, index) =>
				this._generatePlayerHTML(player, index, criteria)
			).join("");
		});
	},

	renderAllRankings: function(players) {
		this.renderRanking('pointRanking', players, 'point');
		this.renderRanking('highScoreRanking', players, 'highScore');
		this.renderRanking('avoidanceRanking', players, 'avoidanceRate');
	}
};

function renderAllSeasons() {
	const container = document.getElementById('seasons-container');
	container.innerHTML = '';

	// 按赛季ID排序（新赛季在前）
	const sortedSeasonIds = Object.keys(seasonDatabase).sort().reverse();

	sortedSeasonIds.forEach(seasonId => {
		const season = seasonDatabase[seasonId];
		const awards = season.awards;

		// 1. 添加排行榜部分（独立全宽区块）
		container.innerHTML += `
      <div class="full-section">
        <div class="season-rankings">
          <div class="game">
            <div class="leftpart">
              <img src="img/${seasonId}.png" height="100">
            </div>
            <div class="ranklist">
              <div class="Title1">
                <h3>個人スコア</h3>
                <ul class="pointRanking" data-season="${seasonId}"></ul>
              </div>
              <div class="Title2">
                <h3>最高スコア</h3>
                <ul class="highScoreRanking" data-season="${seasonId}"></ul>
              </div>
              <div class="Title3">
                <h3>4着回避率</h3>
                <ul class="avoidanceRanking" data-season="${seasonId}"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>`;

		// 2. 添加奖项部分（独立全宽区块）
		container.innerHTML += `
      <div class="full-section">
        <div class="award-section">
          <div class="award-header">
            <h2><i class="fas fa-trophy"></i> 获奖名单</h2>
          </div>
          <div class="season-info">
            <i class="fas fa-calendar-alt"></i> 比赛赛季: <span>${season.seasonName}</span> |
            <i class="fas fa-clock"></i> 比赛日期: <span>${season.startDate}-${season.endDate}</span> |
            <i class="fas fa-users"></i> 参赛选手: <span>${season.playersCount}人</span>
          </div>
          <div class="Award">
            ${generateAwardItem(awards.champion, 'champion', '優勝', 'fas fa-crown')}
            ${generateAwardItem(awards['high-point'], 'high-point', '最高得点賞', 'fas fa-star')}
            ${generateAwardItem(awards['avoid-fourth'], 'avoid-fourth', '四着回避賞', 'fas fa-shield-alt')}
            ${generateAwardItem(awards['full-attendance'], 'full-attendance', '皆勤賞', 'fas fa-calendar-check')}
          </div>
        </div>
      </div>`;
	});

	// 渲染排行榜
	sortedSeasonIds.forEach(seasonId => {
		const season = seasonDatabase[seasonId];
		RankRenderer.renderRanking(
			`.pointRanking[data-season="${seasonId}"]`,
			season.players,
			'point'
		);
		// 最高得分榜（添加这部分）
		RankRenderer.renderRanking(
			`.highScoreRanking[data-season="${seasonId}"]`,
			season.players,
			'highScore'
		);
		// 回避率榜（添加这部分）
		RankRenderer.renderRanking(
			`.avoidanceRanking[data-season="${seasonId}"]`,
			season.players,
			'avoidanceRate'
		);
	});

	// 添加点击事件
	document.querySelectorAll('.award-item').forEach(card => {
		card.addEventListener('click', () => {
			window.open("Award_Instructions.html", "_blank");
		});
	});
}




// 生成奖项项目HTML
function generateAwardItem(award, type, title, icon) {
	if (!award) return '';

	const isChampion = type === 'champion';
	const hasAvoidance = type === 'avoid-fourth';
	const hasAttendance = type === 'full-attendance';

	const medalColor = isChampion ? 'gold' : (hasAttendance ? 'silver' : '#9b59b6');

	return `
  <div class="award-item">
    <div class="award-title ${type}">
      <div class="award-icon">
        <i class="${icon}"></i>
      </div>
      <div class="medal">
        <i class="fas fa-medal"></i>
      </div>
      ${title}
    </div>
    <div class="player-photo">
      <img src="${award.avatar}" alt="${award.name}">
    </div>
    <div class="player-name">${award.name}</div>
    <div class="stats">
      <div class="stat-item">
        <div class="stat-value">${award.ranking}位</div>
        <div class="stat-label">总排名</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${award.point}</div>
        <div class="stat-label">个人得分</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${hasAvoidance ? award.avoidanceRate :
					hasAttendance ? award.attendance :
						award.highScore
				}</div>
        <div class="stat-label">${hasAvoidance ? "回避率" :
					hasAttendance ? "出勤率" :
						"最高得分"
				}</div>
      </div>
    </div>
  </div>`;
};
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
document.querySelectorAll('.award-item').forEach(card => {
	card.addEventListener('click', () => {
		window.open("award_instructions.html", "_blank");
	});
});
const directory = document.querySelectorAll('.target-fix');
const links = document.querySelectorAll('.top a');
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropbtn = document.querySelector('.dropbtn');
window.addEventListener('scroll', function() {
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
