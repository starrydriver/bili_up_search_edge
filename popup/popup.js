// popup.js
document.getElementById("myButton").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	  if (!tabs[0]) {
		console.error("没有找到活动标签页");
		return;
	  }
  
	  // 修改消息内容（不再需要 targetId）
	  chrome.tabs.sendMessage(
		tabs[0].id,
		{ 
		  action: "insertButton"  // 移除了 targetId 参数
		},
		(response) => {
		  if (chrome.runtime.lastError) {
			console.error("消息发送失败:", JSON.stringify(chrome.runtime.lastError));
			return;
		  }
		  
		  // 添加错误处理
		  if (response && response.status === "done") {
			window.close();
		  } else if (response && response.status === "error") {
			alert("插入失败: " + response.message);
		  }
		}
	  );
	});
  });