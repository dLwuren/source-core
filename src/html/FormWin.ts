import '../static/FormWin.css'
import { post, getFormData } from '../utils/index';

document.oncontextmenu = function (e) {
  return false;
}

// ----------------------- 表单 -----------------------

const form = document.getElementById('form') as HTMLFormElement

// 点击确定按钮，获取表单填入内容
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const formData = getFormData(form);
  const { dataset, tagName } = document.getElementById("form-submit")
  let uuid = dataset.uuid

  post('/socket', {
    "type": "sendData",
    "uuid": uuid,
    "data": JSON.stringify(formData)
  })

  Niva.api.window.close()
})

// ----------------------- 标题栏 -----------------------

let isTop = false // 窗口置顶

document.getElementById('g-title').addEventListener('mousedown', (e) => {
  const target = e.target as HTMLElement
  if (target.id !== "g-title") return
  Niva.api.window.dragWindow();
})

document.getElementById('pin').addEventListener('click', () => {
  Niva.api.window.setAlwaysOnTop(!isTop)
  isTop = !isTop
})

document.getElementById('minimize').addEventListener('click', () => {
  Niva.api.window.setMinimized(true)
})

document.getElementById('maximize').addEventListener('click', () => {
  Niva.api.window.isMaximized().then((isMaximized: boolean) => {
    if (isMaximized) Niva.api.window.setMaximized(false)
    else Niva.api.window.setMaximized(true)
  })
})

document.getElementById('close').addEventListener('click', () => {
  Niva.api.window.close()
})

// ----------------------- 窗口通讯 -----------------------

Niva.addEventListener(
  "window.message",
  (eventName: string, payload: { from: number; message: string }) => {
    let html = decodeURIComponent(payload.message)
    document.getElementById('form').innerHTML = html
  }
);
