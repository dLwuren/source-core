import { GraphNodeLayout } from '../GraphicProgramming/graph_node_layout'
import { LanguageAnalysis } from '../GraphicProgramming/language_analysis/index';
import '../static/GraphicProgramming.css'
import {
  post, encodeObj, decodeObj, fromCreate, createManageMenu,
  createHelpMenu, taskPath, generateTimestamp, updateTaskList,
  setTaskPath
} from '../utils/index'
import { socket } from '../utils/socket'

document.oncontextmenu = function (e) {
  return false;
}

// ----------------------- 初始化 -----------------------

const layout = new GraphNodeLayout()
const content = document.getElementById('content')
layout.appendTo(content)

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

// ----------------------- 画布按钮 -----------------------

document.getElementById('run').addEventListener('click', () => {
  // 清除所有的 socket.on (信号启动器) ，避免运行时重复触发
  // 不会清除主界面的 socket.on
  socket.off();
  try {
    const code = new LanguageAnalysis().analysis(layout.toToken(), "js");
    console.log('运行代码', code);
    const run = new Function(
      "post",
      "socket",
      "encodeObj",
      "decodeObj",
      "fromCreate",
      "const fun = " + (code || "function(){}") + "; fun()");
    run(post, socket, encodeObj, decodeObj, fromCreate);
  } catch (error) {
    console.log('发生错误', error);
  }
})

document.getElementById('dev-tool').addEventListener('click', () => {
  Niva.api.webview.openDevtools()
})

document.getElementById('reload').addEventListener('click', () => {
  location.reload()
})

document.getElementById('save').addEventListener('click', () => {
  // 路径为空，则表示没有正在编辑的任务，需要新建一个任务
  if (taskPath == '') {
    post('/file', {
      "type": "getConfig"
    }).then((response) => {
      response.json().then((data) => {
        const path = data.file_path // 获取工作路径
        const timestamp = generateTimestamp() // 生成时间戳
        const newDirName = '未命名分组' + timestamp
        const newFileName = '未命名任务' + timestamp
        const code = new LanguageAnalysis().analysis(layout.toToken(), "js")

        // code 为空，表示没有内容，则不必保存
        if (code) {
          // 新建一个分组
          post('/file', {
            "type": "newFile",
            "name": newDirName,
            "path": path,
            "isDir": true,
            "content": ''
          }).then((res) => {
            // 创建任务
            post('/file', {
              "type": "newFile",
              "name": newFileName + '.js',
              "path": path + '\\' + newDirName,
              "isDir": false,
              "content": code
            }).then(res => {
              updateTaskList()
            })
            post('/file', {
              "type": "newFile",
              "name": newFileName + '.json',
              "path": path + '\\' + newDirName,
              "isDir": false,
              "content": JSON.stringify(layout.export())
            })
            setTaskPath(path + '\\' + newDirName + '\\' + newFileName + '.json')
          })
          // @ts-ignore
          new LightTip('保存成功', 1000, 'success')
        } else {
          // @ts-ignore
          new LightTip('无内容，保存失败', 1200, 'error')
        }
      }).catch(console.error)
    }).catch(console.error)
  } else {
    const code = new LanguageAnalysis().analysis(layout.toToken(), "js")

    post('/file', {
      "type": "writeFile",
      "content": code,
      "path": taskPath.slice(0, -2) // js 文件路径
    })
    post('/file', {
      "type": "writeFile",
      "content": JSON.stringify(layout.export()),
      "path": taskPath
    })

    // @ts-ignore
    new LightTip('保存成功', 1000, 'success')
  }

})

document.getElementById('manage').addEventListener('click', () => {
  createManageMenu(layout)
})

document.getElementById('help').addEventListener('click', () => {
  const html = `
  <h4>🔍 官方文档</h4>
  <p>需要更多帮助信息，请点击：<a>文档</a></p>
  <h4>👆️ 基本操作</h4>
  <p>右键：打开任务节点列表，点击以插入</p>
  <p>左键：选择节点、移动节点、框选节点</p>
  <p>空格 + 左键：移动画布</p>
  <p>Delete：删除节点</p>
  <p>Ctrl + A：选择全部节点</p>
  <p>Ctrl + C：复制节点</p>
  <p>Ctrl + X：剪切节点</p>
  <p>Ctrl + V：粘贴节点</p>
  <p>方向键 ↑ / ↓ / ← / →：向上/下/左/右移动画布</p>
  <h4>👩‍💻 基本使用</h4>
  <p>1.点击「管理」，在一个新「分组」中创建一个新「任务」；</p>
  <p>2.右键插入「任务节点」，并按需求将「任务节点」组装起来；</p>
  <p>3.点击「运行」以测试「任务」是否正常运行；</p>
  <p>4.最后点击「保存」。</p>
  <h4>📢 提示</h4>
  <p>1.每个「任务」都必须有 1 个「开始」节点；</p>
  <p>2.参数名字中带有「*」，表示该参数为必填项；</p>
  <p>3.编辑新的任务时，建议先点击「刷新页面」。</p>
  <h1>🥳 最后，祝使用愉快！！！</h1>
  `
  createHelpMenu(html)
})

// ----------------------- 窗口通讯 -----------------------

// Niva.addEventListener(
//   "window.message",
//   (eventName: string, payload: { from: number; message: string }) => {
//     console.log(payload);
//   }
// );
