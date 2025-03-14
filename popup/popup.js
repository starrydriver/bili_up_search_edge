// popup.js
document.addEventListener("DOMContentLoaded", () => {
	const temp1 = document.getElementById("myP1");
	const temp2 = document.getElementById("myP2");
	function insertButton() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (!tabs[0]) {
		  console.error("没有找到活动标签页");
		  return;
		}
		chrome.tabs.sendMessage(
		  tabs[0].id,
		  { 
			action: "insertButton"
		  },
		  (response) => {
			if (chrome.runtime.lastError) {
			  console.error("消息发送失败:", JSON.stringify(chrome.runtime.lastError));
			  return;
			}		
			if (response && response.status === "done") {
			} else if (response && response.status === "error") {
			  alert("插入失败: " + response.message);
			}
		  }
		);
	  });
	};
	chrome.storage.sync.get(['key'], function (result) {
	  const language = result.key;
	  if (language === "value") {
		temp2.textContent = "切换为英文";
		//insertButton();
	  }
	});
	document.getElementById("myButton2").addEventListener("click", () => {
	  chrome.storage.sync.set({key: 'value'}, function () {
		console.log("Data saved.");
	  });
	});
	document.getElementById("myButton").addEventListener("click", () => {
		insertButton();
	});
}); 