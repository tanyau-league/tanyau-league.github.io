const apiUrl = `https://api.github.com/repos/tanyau-league/tanyau-league-data/contents/AllData.json`;
async function getGitHubFile() {
	let kimoi=['g','i','t','h','u','b','_','p','a','t','_','1','1','B','Q','W','W','U','P','I','0','U','R','H','5','O','Y','o','J','z','5','3','3','_','v','j','C','y','K','M','H','M','p','j','g','t','I','f','0','4','z','d','P','u','I','O','e','F','e','p','7','c','w','M','W','5','G','U','Z','k','D','8','Z','V','h','i','F','O','4','H','2','Z','3','E','N','X','H','X','p','T','0','t','A'];
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
