//------------------------socket 连接------------------------
import io from './socket.io.js'
import { post, encodeObj ,decodeObj } from './index'

// socket 跨域时要填入服务器端口
export let socket = io("http://127.0.0.1:5030");

// 页面刷新就连接 socket
export function connectSocket() {
  document.addEventListener('DOMContentLoaded', function () {
    socket.on('connect', function () {
      socket.send('连接成功');
    });
  });
}

// 点击按钮发送消息给服务器
// document.getElementById('socket').addEventListener('click', function () {
//   console.log('点击了 socket');
//   socket.emit("hello", "world");
// })

// 执行服务器发送过来的代码
socket.on("runTask", function (msg) {
  try {
    const code = msg.code
    const run = new Function(
      "post",
      "socket",
      "encodeObj",
      "decodeObj",
      "const fun = " + (code || "function(){}") + "; fun()");
    run(post, socket, encodeObj, decodeObj);
  } catch (error) {
    console.log('发生错误', error);
  }
})