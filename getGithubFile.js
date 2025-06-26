const apiUrl = `https://api.github.com/repos/tanyau-league/tanyau-league-data/contents/AllData.json`;
async function getGitHubFile() {
	let token=atob("Z2l0aHViX3BhdF8xMUJRV1dVUEkwaHl1elFZSGVjdEZhX3I4d0hKMlIwdlEycmpDRmRpUTJyUEVSQk1nZHhLNmR6ZUtaNzNnZ1FGdkVJVUNHSFFQT09LZVlydzBK");
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
