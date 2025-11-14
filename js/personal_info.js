// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get('player') || '未知玩家';
const playerAvatar = document.getElementById('player-avatar');
const encodedPlayerName = encodeURIComponent(playerName);
const avatarPath = `img/members/${encodedPlayerName}.jpg`;

playerAvatar.src = avatarPath;

// 添加头像加载失败处理
function handleAvatarError(imgElement) {
    imgElement.style.display = 'none';

    // 创建默认头像图标
    const icon = document.createElement('i');
    icon.className = 'fas fa-user';
    imgElement.parentNode.appendChild(icon);
}

// 更新页面标题和玩家姓名
document.title = `${playerName} - 数据统计`;
document.getElementById('player-name').textContent = playerName;

// 更新数据更新时间
const now = new Date();
document.getElementById('update-time').textContent = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});


// 存储玩家数据
let playerHands = {};
let playerAchievements = {};
let playerDescriptions = {};

// 加载玩家数据（牌型和称号）
async function loadPlayerData() {
    try {
        // 加载牌型数据 JS 文件
        const handsScript = document.createElement('script');
        handsScript.src = 'data/hands.js';
        document.head.appendChild(handsScript);

        // 加载牌型描述 JS 文件
        const descriptionsScript = document.createElement('script');
        descriptionsScript.src = 'data/descriptions.js';
        document.head.appendChild(descriptionsScript);

        // 加载称号数据 JS 文件
        const achievementsScript = document.createElement('script');
        achievementsScript.src = 'data/achievements.js';
        document.head.appendChild(achievementsScript);

        // 等待数据加载完成
        await new Promise((resolve) => {
            let loadedCount = 0;
            const checkLoaded = () => {
                if (++loadedCount === 3) resolve();
            };

            handsScript.onload = checkLoaded;
            descriptionsScript.onload = checkLoaded;
            achievementsScript.onload = checkLoaded;

            // 添加错误处理
            handsScript.onerror = checkLoaded;
            descriptionsScript.onerror = checkLoaded;
            achievementsScript.onerror = checkLoaded;
        });

        // 确保全局变量存在
        window.playerHands = window.playerHands || {};
        window.playerDescriptions = window.playerDescriptions || {};
        window.playerAchievements = window.playerAchievements || {};

    } catch (error) {
        console.error('加载玩家数据失败:', error);
        window.playerHands = {};
        window.playerDescriptions = {};
        window.playerAchievements = {};
    }
}

// 获取比赛数据并渲染
(async function () {
    try {
        // 先加载玩家数据
        await loadPlayerData();

        // 然后获取比赛数据
        const data = JSON.parse((await getGitHubFile()).content);
        const stats = calculateStats(data, playerName);
        renderStats(stats);
    } catch (e) {
        showError(`数据处理错误: ${e.message}`);
    }
})();

// 显示错误信息
function showError(message) {
    const container = document.getElementById('stats-container');
    container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>数据加载失败</h3>
                <p>${message}</p>
                <p>请稍后刷新页面重试</p>
            </div>
        `;
}

// 统计数据计算函数
function calculateStats(data, targetPlayerName) {
    // 初始化统计变量
    let stats = {
        rank1Count: 0,
        rank2Count: 0,
        rank3Count: 0,
        rank4Count: 0,
        totalGames: 0,
        totalRounds: 0,
        winCount: 0,
        tsumoCount: 0,
        dealInCount: 0,
        riichiCount: 0,
        totalWinPoints: 0,
        totalDealInPoints: 0
    };

    // 遍历所有比赛
    data.forEach(match => {
        let playerInfo = null;
        let playerId = null;

        // 查找玩家信息和ID
        for (let i = match.logs.length - 1; i >= 0; i--) {
            const log = match.logs[i];
            if (log.type === 'player_info') {
                playerInfo = log;
                // 找到目标玩家的ID
                for (const player of log.player) {
                    if (player.name === targetPlayerName) {
                        playerId = player.id;
                        break;
                    }
                }
                break;
            }
        }

        // 如果没有找到玩家信息，跳过这场比赛
        if (!playerInfo || playerId === null) return;

        // 统计顺位
        const playerRank = playerInfo.player.find(p => p.id === playerId).rank;
        if (playerRank === 1) stats.rank1Count++;
        else if (playerRank === 2) stats.rank2Count++;
        else if (playerRank === 3) stats.rank3Count++;
        else if (playerRank === 4) stats.rank4Count++;
        stats.totalGames++;

        // 遍历比赛日志
        let currentRound = null;
        match.logs.forEach(log => {
            // 记录回合开始
            if (log.type === 'round') {
                currentRound = log;
                stats.totalRounds++;
                return;
            }

            // 跳过非回合日志
            if (!currentRound) return;

            // 使用switch处理不同事件类型
            switch (log.type) {
                case 'reach':
                    if (log.player === playerId) {
                        stats.riichiCount++;
                    }
                    break;

                case 'ron':
                    const ronScore = log.score;
                    if (ronScore[playerId] > 0) {
                        // 玩家荣和
                        stats.winCount++;
                        stats.totalWinPoints += ronScore[playerId];
                    } else if (ronScore[playerId] < 0) {
                        // 玩家放铳
                        stats.dealInCount++;
                        stats.totalDealInPoints += Math.abs(ronScore[playerId]);
                    }
                    break;

                case 'tsumo':
                    const tsumoScore = log.score;
                    if (tsumoScore[playerId] > 0) {
                        // 玩家自摸
                        stats.winCount++;
                        stats.tsumoCount++;
                        stats.totalWinPoints += tsumoScore[playerId];
                    }
                    // 自摸时其他玩家支付不算放铳
                    break;

                case 'howannpai_ryuukyoku':
                    // 流局，不做特殊处理
                    break;

                case 'agari_kyoutaku':
                    // 供托，不计入点数统计
                    break;

                // 其他事件类型可以在这里添加
            }
        });
    });

    // 计算最终统计数据
    const rank1Rate = stats.totalGames > 0 ? stats.rank1Count / stats.totalGames : 0;
    const rank2Rate = stats.totalGames > 0 ? stats.rank2Count / stats.totalGames : 0;
    const rank3Rate = stats.totalGames > 0 ? stats.rank3Count / stats.totalGames : 0;
    const rank4Rate = stats.totalGames > 0 ? stats.rank4Count / stats.totalGames : 0;

    const avgRank = stats.totalGames > 0 ?
        (stats.rank1Count * 1 + stats.rank2Count * 2 + stats.rank3Count * 3 + stats.rank4Count * 4) / stats.totalGames : 0;

    const winRate = stats.totalRounds > 0 ? stats.winCount / stats.totalRounds : 0;
    const tsumoRate = stats.totalRounds > 0 ? stats.tsumoCount / stats.winCount : 0;
    const dealInRate = stats.totalRounds > 0 ? stats.dealInCount / stats.totalRounds : 0;
    const riichiRate = stats.totalRounds > 0 ? stats.riichiCount / stats.totalRounds : 0;

    const avgWinPoints = stats.winCount > 0 ? stats.totalWinPoints / stats.winCount : 0;
    const avgDealInPoints = stats.dealInCount > 0 ? stats.totalDealInPoints / stats.dealInCount : 0;

    // 净打点效率 = 和率*平均打点 - 铳率*平均铳点
    const netPointEfficiency = (winRate * avgWinPoints) - (dealInRate * avgDealInPoints);

    return {
        rank1Rate: rank1Rate,
        rank2Rate: rank2Rate,
        rank3Rate: rank3Rate,
        rank4Rate: rank4Rate,
        totalGames: stats.totalGames,
        totalRounds: stats.totalRounds,
        avgRank: avgRank,
        winRate: winRate,
        tsumoRate: tsumoRate,
        dealInRate: dealInRate,
        riichiRate: riichiRate,
        avgWinPoints: avgWinPoints,
        avgDealInPoints: avgDealInPoints,
        netPointEfficiency: netPointEfficiency,
        rank1Count: stats.rank1Count,
        rank2Count: stats.rank2Count,
        rank3Count: stats.rank3Count,
        rank4Count: stats.rank4Count
    };
}

// 渲染麻将牌的函数
function renderTiles(tiles) {
    let html = '';
    // 创建20个槽位
    for (let i = 0; i < 20; i++) {
        if (i < tiles.length) {
            const tile = tiles[i];
            html += `
                    <div class="tile-slot">
                        <img src="img/majhong/${tile}.svg" alt="${tile}" class="mahjong-tile">
                    </div>
                `;
        } else {
            html += `<div class="tile-slot"></div>`;
        }
    }
    return html;
}

//渲染和牌描述的函数
function renderDescriptions(descriptions) {
    // 确保 descriptions 是数组类型
    if (!Array.isArray(descriptions)) {
        descriptions = [descriptions];
    }

    // 处理描述不存在的情况
    if (!descriptions || descriptions.length === 0) {
        return '<div class="no-description">暂无牌型描述</div>';
    }
    
    // 正确处理数组类型的描述
    let html = '<div class="descriptions-container">';
    descriptions.forEach(desc => {
        html += `<p>${desc}</p>`;
    });
    html += '</div>';
    return html;
}

// 渲染称号的函数
function renderAchievements(achievements) {
    let html = '';
    achievements.forEach(achievement => {
        html += `
                <div class="achievement-slot">
                    <img src="img/achievements/${achievement}.png" alt="${achievement}" title="${achievement}">
                </div>
            `;
    });

    // 如果没有称号，显示提示信息
    if (achievements.length === 0) {
        html = `<div class="no-achievements">该玩家尚未获得任何称号</div>`;
    }

    return html;
}

// 渲染统计信息
function renderStats(stats) {
    const container = document.getElementById('stats-container');

    // 清空加载动画
    container.innerHTML = '';

    // 调试信息 - 帮助我们查看实际加载的数据
    console.log("Player Name:", playerName);
    console.log("Player Hands:", window.playerHands[playerName]);
    console.log("Player Descriptions:", window.playerDescriptions[playerName]);
    console.log("Player Achievements:", window.playerAchievements[playerName]);

    // 获取当前玩家的牌型和称号
    const handTiles = window.playerHands[playerName] || [];
    const descriptions = window.playerDescriptions[playerName] || [];
    const achievements = window.playerAchievements[playerName] || [];

    // 创建统计网格
    const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card full-width">
                    <h3><i class="fas fa-medal"></i> 称号墙</h3>
                    <div class="achievement-wall">
                        ${renderAchievements(achievements)}
                    </div>
                </div>
  
                <div class="stat-card full-width">
                    <h3><i class="fas fa-trophy"></i> 最近大和</h3>
                    <div class="mahjong-tiles">
                        ${renderTiles(handTiles)}
                    </div>
                    <div class="hand-description">
                        ${renderDescriptions(descriptions)}
                    </div>
                </div>
                <div class="stat-card">
                    <h3><i class="fas fa-trophy"></i> 平均顺位</h3>
                    <div class="stat-value">${stats.avgRank.toFixed(2)}</div>
                    <div class="stat-desc">${stats.totalGames} 场对局平均表现</div>
                </div>
              
                <div class="stat-card">
                    <h3><i class="fas fa-hand-paper"></i> 和牌率</h3>
                    <div class="stat-value">${(stats.winRate * 100).toFixed(1)}%</div>
                    <div class="stat-desc">${Math.round(stats.winRate * stats.totalRounds)} 次和牌</div>
                </div>
              
                <div class="stat-card">
                    <h3><i class="fas fa-hand-holding"></i> 自摸率</h3>
                    <div class="stat-value">${(stats.tsumoRate * 100).toFixed(1)}%</div>
                    <div class="stat-desc">${Math.round(stats.tsumoRate * stats.winRate * stats.totalRounds)} 次自摸</div>
                </div>
              
                <div class="stat-card">
                    <h3><i class="fas fa-bomb"></i> 放铳率</h3>
                    <div class="stat-value">${(stats.dealInRate * 100).toFixed(1)}%</div>
                    <div class="stat-desc">${Math.round(stats.dealInRate * stats.totalRounds)} 次放铳</div>
                </div>
              
                <div class="stat-card">
                    <h3><i class="fas fa-flag"></i> 立直率</h3>
                    <div class="stat-value">${(stats.riichiRate * 100).toFixed(1)}%</div>
                    <div class="stat-desc">${Math.round(stats.riichiRate * stats.totalRounds)} 次立直</div>
                </div>
              
                <div class="stat-card">
                    <h3><i class="fas fa-coins"></i> 净打点效率</h3>
                    <div class="stat-value">${stats.netPointEfficiency >= 0 ? '+' : ''}${stats.netPointEfficiency.toFixed(0)}</div>
                    <div class="stat-desc">(和率×打点 - 铳率×铳点)</div>
                </div>
            </div>
          
            <div class="stat-card">
                <h3><i class="fas fa-crown"></i> 顺位分布</h3>
                <div class="rank-stats">
                    <div class="rank-item">
                        <div>一位率</div>
                        <div class="rank-value">${(stats.rank1Rate * 100).toFixed(1)}%</div>
                        <div>${stats.rank1Count} 次</div>
                    </div>
                    <div class="rank-item">
                        <div>二位率</div>
                        <div class="rank-value">${(stats.rank2Rate * 100).toFixed(1)}%</div>
                        <div>${stats.rank2Count} 次</div>
                    </div>
                    <div class="rank-item">
                        <div>三位率</div>
                        <div class="rank-value">${(stats.rank3Rate * 100).toFixed(1)}%</div>
                        <div>${stats.rank3Count} 次</div>
                    </div>
                    <div class="rank-item">
                        <div>四位率</div>
                        <div class="rank-value">${(stats.rank4Rate * 100).toFixed(1)}%</div>
                        <div>${stats.rank4Count} 次</div>
                    </div>
                </div>
            </div>
          
            <div class="stat-card">
                <h3><i class="fas fa-chart-line"></i> 打点分析</h3>
                <div class="point-analysis">
                    <div class="point-item">
                        <div style="font-size: 1.2rem; margin-bottom: 10px;">平均打点</div>
                        <div style="font-size: 2rem; color: var(--success-color); font-weight: bold;">${stats.avgWinPoints.toFixed(0)}</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">每次和牌得分</div>
                    </div>
                    <div class="point-item">
                        <div style="font-size: 1.2rem; margin-bottom: 10px;">平均铳点</div>
                        <div style="font-size: 2rem; color: var(--danger-color); font-weight: bold;">${stats.avgDealInPoints.toFixed(0)}</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">每次放铳失分</div>
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = statsHTML;
}
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


