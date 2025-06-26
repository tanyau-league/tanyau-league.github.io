const apiUrl = `https://api.github.com/repos/tanyau-league/tanyau-league-data/contents/AllData.json`;
async function getGitHubFile() {
	let kimoi=['g', 'i', 't', 'h', 'u', 'b', '_', 'p', 'a', 't', '_', '1', '1', 'B', 'Q', 'W', 'W', 'U', 'P', 'I', '0', 'B', '7', 'p', '1', 'o', 'o', '8', 'P', 'M', 'r', 'N', 'K', '_', 'q', 'Z', 'd', '4', 'e', 'v', '2', 'd', 'J', 'J', 'W', 'B', '2', 'n', 'j', 'B', 'J', 'A', 'B', 's', 'L', 'W', 'H', 'z', 'Q', '3', 'T', '1', 'Z', 'k', 'X', 'H', '8', '8', 'R', 'v', 'd', 'B', 'e', 'M', 'n', 'd', 'a', '2', 'I', 'A', 'L', 'D', 'W', 'Z', 'U', 'p', '0', '2', 'Q', '9', 'p', '3', 'C'];
	let token="";
	for(let i=0;i<kimoi.length;i++){
		token+=kimoi[i];
	}
	try {
		const response = await fetch(apiUrl, {
			headers: {
				"Authorization": `token ${token}`,
				"Accept": "application/vnd.github.v3+json"
			}
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const fileData = await response.json();
		const content = decodeURIComponent(escape(atob(fileData.content)));
		return {
			content: content,
			sha: fileData.sha,
			path: fileData.path,
			size: fileData.size
		};
	} catch (error) {
		console.error("读取文件出错:", error);
		throw error;
	}
}
