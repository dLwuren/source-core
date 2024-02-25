import '../src/static/index.css'

// Niva 的 api 无需引入
import { NivaWindowOptions, NivaTrayOptions, MenuOptions } from '../env'
import { post, createSettingsMenu, renderListHTML, encodeObj, decodeObj, fromCreate, createDialog } from './utils/index'
import { connectSocket, socket } from './utils/socket'

// ----------------------- 窗口 -----------------------

// 主窗口尺寸
const winSize = {
  width: 300,
  height: 400
}

// 将窗口位置移至鼠标所在位置
const setWinPosition = () => {
  Niva.api.window.cursorPosition().then((position) => {
    const { x, y } = position
    position = {
      x: x + 30,
      y: y - winSize.height / 2
    }
    Niva.api.window.setOuterPosition(position).then(() => {
      Niva.api.window.setVisible(true)
    })
  })
}

// 更新任务列表
const updateTaskList = () => {
  // 更新任务列表
  post('/file', {
    "type": "fileList"
  }).then((response) => {
    if (!response) return
    response.json().then((data) => {
      renderListHTML(data)
    }).catch(e => console.log('请求错误', e))
  }).catch(e => console.log('请求错误', e))
}

// 更新启动器
const updataStarter = () => {
  // 更新启动器
  post('/starter', {
    "type": "updataStarter",
  }).catch(e => console.log('请求错误', e))
}

// Niva.api.window.setInnerSize(winSize)
// Niva.api.window.setMinInnerSize(winSize)
// Niva.api.window.setTitle('源核')
// Niva.api.window.setDecorated(false)
// Niva.api.window.setAlwaysOnTop(true)

// 关闭浏览器默认的右键菜单（上下文菜单）
document.oncontextmenu = function (e) {
  return false;
}

// 自定义任务 窗口配置
const options: NivaWindowOptions = {
  devtools: true,
  title: '自定义任务',
  size: {
    width: 830,
    height: 530
  },
  decorations: false,
  // 相对路径是以 dist 中的情况为准
  entry: './GraphicProgramming.html'
}

// 思维导图 窗口配置
const options2: NivaWindowOptions = {
  devtools: true,
  title: '思维导图',
  size: {
    width: 830,
    height: 530
  },
  decorations: false,
  // 相对路径是以 dist 中的情况为准
  entry: './MindMapping.html'
}

// 设置快捷键 窗口配置
const options3: NivaWindowOptions = {
  devtools: true,
  title: '设置快捷键',
  size: {
    width: 830,
    height: 560
  },
  decorations: false,
  // resizable: false, // 禁止调整大小
  // 相对路径是以 dist 中的情况为准
  entry: './SetHotkey.html'
}

// 初始化
Niva.api.process.pid().then((pid) => {
  post('/init', {
    "pid": pid
  })

  updateTaskList()
})

connectSocket()

// ----------------------- 托盘、快捷键 -----------------------

// 点击托盘菜单事件
Niva.addEventListener(
  "menu.clicked",
  (eventName: string, menuId: number) => {
    if (menuId === 1) Niva.api.window.setVisible(true)
    if (menuId === 2) {
      Niva.api.tray.destroyAll()
      Niva.api.window.close(0)
    }
  }
)

// 托盘鼠标左击事件
Niva.addEventListener(
  "tray.leftClicked",
  (eventName: string, trayId: number) => {
    Niva.api.window.setVisible(true)
  }
)

// 处理快捷键事件
Niva.addEventListener(
  "shortcut.emit",
  (eventName: string, shortcutId: number) => {
    // shift + ctrl + alt + 方向键↑ 唤出/隐藏主窗口
    if (shortcutId = 1) {
      Niva.api.window.isVisible().then((visible) => {
        if (visible) {
          Niva.api.window.setVisible(false)
        } else {
          setWinPosition()
        }
      }).catch((e) => console.log('快捷键错误', e))
    }
  }
);

// ----------------------- 标题栏 -----------------------

// 使窗口可拖动
document.getElementById('g-title').addEventListener('mousedown', (e) => {
  const target = e.target as HTMLElement
  if (target.id !== "g-title") return
  Niva.api.window.dragWindow();
})

document.getElementById('help').addEventListener('click', () => {
  const content = `
    <h1>123</h1>
  `
  createDialog('帮助', content)
})

document.getElementById('set-hotkey').addEventListener('click', () => {
  Niva.api.window.open(options3)
})

document.getElementById('updata').addEventListener('click', () => {
  updateTaskList()
  updataStarter()

  // 更新启动器后重新运行
  post('/starter', {
    "type": "runStarter",
  }).catch(e => console.log('请求错误', e))
})

document.getElementById('setting').addEventListener('click', () => {
  createSettingsMenu()
})

document.getElementById('close').addEventListener('click', () => {
  Niva.api.window.setVisible(false)
})

// ----------------------- 内置工具 -----------------------

document.getElementById('auto-task').addEventListener('click', () => {
  Niva.api.window.open(options).then((winId) => {
    Niva.api.window.current().then((curId) => {
      setTimeout(() => {
        Niva.api.window.sendMessage(encodeObj({
          "type": "getIndexId",
          "uuid": curId
        }), winId)
      }, 3000)

    })
  })
})

document.getElementById('win-info').addEventListener('click', () => {
  post('/tool', {
    "type": "winInfoTool"
  }).catch(e => console.log('请求错误', e))
})

document.getElementById('mind-mapping').addEventListener('click', () => {
  Niva.api.window.open(options2)
})

// ----------------------- 任务卡片 -----------------------

// 委托事件，点击按钮执行任务
document.getElementById('m-test-card').addEventListener('click', (event) => {
  event.preventDefault()

  const { dataset, tagName } = event.target as HTMLElement
  if (tagName === "BUTTON") {

    let path = dataset && dataset.path
    path = path.replace(/\\/g, "\\\\")
    // 点击按钮后，切换到上一个窗口
    post('/ahk', {
      "type": "switchPrevWin"
    }).then(() => {
      post('/file', {
        "type": "getJs",
        "path": path
      }).then((response) => {
        response.text().then((data) => {
          try {
            const code = data;
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
        }).catch(e => console.log('请求错误', e))
      }).catch(e => console.log('请求错误', e))
    })
  }
})

// ----------------------- 窗口通讯 -----------------------

/**
 * 其它窗口使用 Niva.api.window.sendMessage("消息", 0) 来发送消息给 index 窗口
 * index 窗口始终是第 1 个窗口，所以其 id 必定为 0
 */
Niva.addEventListener(
  "window.message",
  (eventName: string, payload: { from: number; message: string }) => {
    const { from, message } = payload
    const data = decodeObj(message)
    console.log(data)

    switch (data["type"]) {
      case "updateTaskList":
        // 更新任务列表
        updateTaskList()
        break
      case "updataStarter":
        // 更新启动器
        updataStarter()

        post('/starter', {
          "type": "runStarter",
        }).catch(e => console.log('请求错误', e))
        break
    }
  }
);