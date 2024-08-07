// ==UserScript==
// @name          Telegram Brush Helper V0.2
// @namespace     http://tampermonkey.net/
// @version       0.2
// @description   Add custom floating buttons to Telegram web app
// @author        BrushBots
// @match         https://web.telegram.org/*
// @grant         GM_setClipboard
// @grant         GM_openInTab
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @run-at        document-idle
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @resource      css https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(GM_getResourceText("css"));

  const notyf = new Notyf();

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.right = "10px";
  container.style.transform = "translateY(-50%)";
  container.style.zIndex = "10000";

  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-end";

  const delay = (time) => {
    return new Promise(function (resolve) {
      setTimeout(() => resolve(), time);
    });
  };

  const ensureIframe = async () => {
    const iframe = document.querySelector("iframe");
    if (!iframe) {
      var button = document.querySelector("button.bot-menu");
      var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });

      var mouseDownEvent = new MouseEvent("mousedown", { bubbles: true });
      var mouseUpEvent = new MouseEvent("mouseup", { bubbles: true });

      if (button) {
        button.dispatchEvent(mouseDownEvent);
        button.dispatchEvent(clickEvent);
        button.dispatchEvent(mouseUpEvent);
      }
      await delay(2000);
    }
  };

  // 创建第一个按钮：复制tg参数
  const copyButton = document.createElement("button");
  copyButton.textContent = "复制tg参数";
  copyButton.style.marginBottom = "10px";
  copyButton.style.padding = "10px 20px";
  copyButton.style.border = "none";
  copyButton.style.borderRadius = "5px";
  copyButton.style.minWidth = "120px";
  copyButton.style.backgroundColor = "#3498db";
  copyButton.style.color = "white";
  copyButton.style.cursor = "pointer";
  copyButton.onclick = async function click() {
    await ensureIframe();
    const query = document.querySelector("iframe")?.src?.match(/query.*/)[0];
    if (query) {
      GM_setClipboard(query);
      notyf.success("已复制到剪贴板");
    } else {
      const query = document.querySelector("iframe")?.src?.match(/query.*/)[0];
      notyf.error("没有打开小程序");
    }
  };

  // 创建第二个按钮：打开页面
  const openButton = document.createElement("button");
  openButton.textContent = "打开页面";
  openButton.style.padding = "10px 20px";
  openButton.style.border = "none";
  openButton.style.borderRadius = "5px";
  openButton.style.minWidth = "120px";
  openButton.style.backgroundColor = "#e74c3c";
  openButton.style.color = "white";
  openButton.style.cursor = "pointer";
  openButton.onclick = async function xclick() {
    await ensureIframe();
    const src = (document.querySelector("iframe")?.src || "")
      .replace("weba", "android")
      .replace("web", "android");
    if (src) {
      GM_openInTab(src, { active: true });
    } else {
      notyf.error("没有打开小程序");
    }
  };

  container.appendChild(copyButton);
  container.appendChild(openButton);

  document.body.appendChild(container);
})();
