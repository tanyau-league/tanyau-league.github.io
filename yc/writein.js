const apiUrl = `https://api.github.com/repos/tanyau-league/tanyau-league-data/contents/AllData.json`;
async function getGitHubFile(token) {
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

function updateGithubFile(content, fileSHA) {
	var token = prompt("输入 token");
	const contentEncoded = btoa(unescape(encodeURIComponent(content)));
	const headers = {
		"Authorization": `token ${token}`,
		"Accept": "application/vnd.github.v3+json",
	};

	const data = {
		message: "Add data through tanyau-league/yc",
		content: contentEncoded,
		sha: fileSHA
	};

	fetch(apiUrl, {
			method: "PUT",
			headers: headers,
			body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => alert("成功上传数据！"))
		.catch(error => alert("上传失败：" + error));

}

function writein(append_json) {
	getGitHubFile("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")
		.then(file => {
			var temp=JSON.parse(file.content);
			temp.push(append_json);
			let new_json = JSON.stringify(temp);
			console.log(file.content,new_json)
			updateGithubFile(new_json, file.sha);
		})
		.catch(error => console.error("错误:", error));
}
