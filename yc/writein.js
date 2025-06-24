const owner = "tanyau-league";
const repo = "tanyau-league-data";
function writein(path, content){
	var token = prompt("输入 token");
	const contentEncoded = btoa(unescape(encodeURIComponent(content)));
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
	const headers = {
		"Authorization": `token ${token}`,
		"Accept": "application/vnd.github.v3+json",
	};
	
	const data = {
		message: "Add data through tanyau-league/yc",
		content: contentEncoded,
	};
	
	fetch(apiUrl, {
			method: "PUT",
			headers: headers,
			body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => alert("成功上传数据！"))
		.catch(error => alert("上传失败："+error));
	
}
