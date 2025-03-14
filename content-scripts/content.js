// content-scripts/content.js
//监听来自插件的消息（兼容手动点击）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "insertButton") {
	  insertButton();
	  sendResponse({ status: "done" });
	}
});
function scheduleFun() {
	chrome.storage.sync.get(['key'], function(data) {
		if (data.key === "value") {
			insertButton();
		}
	});
    setTimeout(scheduleFun, 2000); // 2 秒后再次调用
}
scheduleFun(); // 启动调度
function insertButton() {
if (document.getElementById("myCustomButton")) return;
// 定位目标元素
const targetDiv = document.querySelector(`
	#app 
	.bili-dyn-home--member 
	main 
	section 
  `);
  const nameDiv_temp1 = document.querySelectorAll(`
	#app 
	.bili-dyn-home--member 
	main 
	section
  `)[1];
  const nameDiv_temp2 = nameDiv_temp1.querySelector(`
	.bili-dyn-up-list
	.bili-dyn-up-list__window
	.bili-dyn-up-list__content
  `);
  //定位翻页元素
  const pageDiv_temp1 = document.querySelectorAll(`
	#app 
	.bili-dyn-home--member 
	main 
	section
  `)[1];
  const pageDiv = pageDiv_temp1.querySelector(`
	.bili-dyn-up-list
	.bili-dyn-up-list__nav.next
	.bili-dyn-up-list__nav__shadow
	.bili-dyn-up-list__nav__btn
  `);
  //---------------------------------------------------------------
   //获取fetch请求

  //---------------------------------------------------------------
  let IsSearch = false;//检测是否有过搜索
  let nameDiv_temp3 = nameDiv_temp2.querySelectorAll(`.bili-dyn-up-list__item`)
  let nameDivItems = Array.from(nameDiv_temp3).slice(1);
  if (!targetDiv) {
	console.error("目标容器未找到");
	sendResponse({ status: "error", message: "目标容器不存在" });
	return true;
  }
  if (!pageDiv) {
	console.error("翻页按钮未找到");
	sendResponse({ status: "error", message: "翻页按钮不存在" });
	return true;
  }
  const result = document.createElement("p");
  const button = document.createElement("button");
  const lodingButton = document.createElement("button");
  const input = document.createElement("input");
  const myDiv = document.createElement("div");
  myDiv.id = "myCustomButton";
  result.textContent = "请输入UP名称进行搜索";
  button.textContent = "动态按钮";
  lodingButton.textContent = "加载所有UP";
  button.style.cssText = "padding: 10px; background: #4CAF50; color: white; margin: 10px;";
  lodingButton.style.cssText = "padding: 10px; background: #4CAF50; color: white; margin: 10px;";
  input.style.cssText = "margin: 10px;";
  myDiv.style.cssText ="width: 720px;height: 100px;border: 2px solid #ffffff;background-color: #ffffff;border-radius: 10px;";
  //插入元素
  targetDiv.appendChild(result);
  targetDiv.appendChild(myDiv);
  myDiv.appendChild(button);
  myDiv.appendChild(lodingButton);
  myDiv.appendChild(input);
  //函数定义
  //异步点击
  async function autoClick(btn, times) {
	for(let i=0; i<times; i++) {
	  btn.click();
	  await new Promise(r => setTimeout(r, 500)); // 每次点击间隔 0.5 秒
	}
	const result = document.createElement("p");
	result.textContent = "已加载所有UP";
	targetDiv.appendChild(result);
	nameDiv_temp3 = nameDiv_temp2.querySelectorAll(`.bili-dyn-up-list__item`)
	nameDivItems = Array.from(nameDiv_temp3).slice(1);
  }
  //元素事件
  button.addEventListener("click", () => {
	
	result.textContent = "已搜索"+input.value+"的动态";
	//检索用户名
	if(IsSearch===true)
	{
		IsSearch = false;
		for(let i=0;i<nameDivItems.length;i++){
			nameDivItems[i].style.display = "block";
		}
	}
	for(let i=0;i<nameDivItems.length;i++){
		const nameDiv = nameDivItems[i].querySelector(`.bili-dyn-up-list__item__name.bili-ellipsis`)
		const myText = nameDiv.textContent.trim();
		if(!myText.includes(input.value)){
			nameDivItems[i].style.display = "none";
		}
	}
	IsSearch = true;
  });
  //加载所有用户名
  lodingButton.addEventListener("click", () => {
	nameDiv_temp3 = null;
	nameDivItems = null;
	const count_click = 7;
	autoClick(pageDiv, count_click);
  });
  sendResponse({ status: "done" });
  return true;
}
