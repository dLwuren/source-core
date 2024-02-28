// 基于 Mousetrap 监听用户输入的快捷键
// 项目地址 https://github.com/ccampbell/mousetrap
import '../static/SetHotkey.css'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/record/mousetrap-record.js'

import { EditorState } from "@codemirror/state"
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view"
import { tomorrow } from 'thememirror'
import { insertTab, indentLess } from "@codemirror/commands"
import { javascript as js } from '@codemirror/lang-javascript'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { languages } from "@codemirror/language-data"

import { createAhkHotkey, createHelpMenu, getFormData, post, updataStarter } from "../utils/index"

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

// ----------------------- 编辑器初始化 -----------------------

const cwTheme: any = {
  '&': {
    color: 'var(--bl-editor-color)',
    backgroundColor: 'var(--bl-editor-bg-color)',
    fontSize: '14px'
  },
  '.cm-panels': {
    backgroundColor: 'var(--bl-editor-gutters-bg-color)',
    color: 'var(--el-color-primary)'
  },
  '.cm-panels-top': {
    'z-index': '999',
    borderColor: 'var(--el-border-color)'
  },
  '.cm-panels-bottom': {
    borderColor: 'var(--el-border-color)'
  },
  '.cm-textfield': {
    backgroundColor: 'var(--bl-editor-bg-color)',
    border: '1px solid var(--el-border-color)',
    outline: 'none'
  },
  '.cm-button': {
    backgroundImage: 'none',
    backgroundColor: 'var(--bl-editor-bg-color)',
    border: '1px solid var(--el-border-color)'
  },
  '.cm-button::active': {
    backgroundColor: 'var(--bl-text-bg-color)'
  },
  '.cm-gutters': {
    backgroundColor: 'var(--bl-editor-gutters-bg-color)',
    borderColor: 'var(--bl-editor-gutters-border-color)',
    color: 'var(--bl-editor-gutters-color)',
    fontSize: '12px',
    width: '50px',
    minWidth: '50px',
    maxWidth: '50px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--bl-editor-gutters-bg-color)',
    color: 'var(--el-color-primary)'
  },
  '.cm-lineNumbers': {
    width: '40px'
  },
  '.cm-scroller': {
    overflow: 'overlay',
    outline: 'none'
  },
  '.cm-foldGutter': {
    // paddingRight: '3px'
  },
  '.cm-content': {
    whiteSpace: 'break-spaces',
    wordWrap: 'break-word',
    // overflow: 'auto',
    width: 'calc(100% - 55px)',
    padding: '0',
    caretColor: '#707070'
  },
  '.cm-line': {
    // color: '#707070'
    // caretColor: 'var(--bl-editor-caret-color) !important',
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    padding: '0'
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--bl-editor-active-line-gutter-bg-color)'
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--bl-editor-selection-match-bg-color)'
  },
  '.ͼ1.cm-focused': {
    outline: 'none'
  },
  '.ͼ2 .cm-activeLine': {
    backgroundColor: 'var(--bl-editor-active-line-gutter-bg-color)'
  },
  '.ͼ5': {
    // color: 'var(--bl-editor-c5-color)',
    color: 'var(--el-color-primary)',
    fontWeight: '700'
  },
  '.ͼ6': {
    color: '#707070',
    fontWeight: '500'
  },
  '.ͼ7': {
    backgroundColor: 'var(--bl-editor-c7-bg-color)',
    // color: 'var(--bl-editor-c7-color)'
    // backgroundColor: 'var(--el-color-primary)',
    color: 'var(--el-color-primary)'
  },
  '.ͼc': {
    color: 'var(--bl-editor-cc-color)'
  },
  // ͼm: 注释   #940
  '.ͼm': {
    color: 'var(--bl-editor-cm-color)'
  },
  // ͼb: 关键字 #708
  '.ͼb': {
    color: 'var(--bl-editor-cb-color)'
  },
  // ͼd: 数字 #708
  '.ͼd': {
    color: 'var(--bl-editor-cd-color)'
  },
  // ͼe: 字符串 #a11
  '.ͼe': {
    color: 'var(--bl-editor-ce-color)'
  },
  //ͼi: 类名:
  '.ͼi': {
    color: 'var(--bl-editor-ci-color)'
  },
  //ͼg: 方法名和参数
  '.ͼg': {
    color: 'var(--bl-editor-cg-color)'
  }
}
let docContent = ''

// 指明编辑器的状态, 编辑器的使用和状态都和该对象有关, 例如编辑记录 redo/undo
const state = EditorState.create({
  // 编辑器的初始内容
  doc: docContent,
  // 拓展
  extensions: [
    tomorrow,
    // 这是一个基础的配置, 包含一系列常用的配置, 如快捷键等等, 行数, 查询等等功能...
    // https://codemirror.net/docs/ref/#codemirror.basicSetup
    // basicSetup,
    lineNumbers({}), // 显示行号
    EditorView.lineWrapping, // 自动换行
    js(), // 编辑器的语言支持
    EditorView.theme(cwTheme, { dark: false }), // 样式
    syntaxHighlighting(defaultHighlightStyle, { //语法高亮
      fallback: true
    }),
    // 快捷键
    keymap.of([
      // 缩进
      { key: 'Tab', run: insertTab, },
      // 取消缩进
      { key: 'Shift-Tab', run: indentLess },
      // 自定义快捷键
      // { key: 'Ctrl-s', run(_view: EditorView) { saveCallback(); return true } }
    ]),
    // 修改内容时的监听, 当内容变更时触发
    EditorView.updateListener.of((viewUpd: ViewUpdate) => {
      if (viewUpd.docChanged) {
        const doc = view.state.doc;
        const value = doc.toString();
        docContent = value;
      }
    })
  ]
})

// 创建编辑器实例
const view = new EditorView({
  // 上方创建的 state
  state: state,
  // 编辑器的父 dom 元素
  parent: document.getElementById('editor')
})

/**
 * 修改 codemirror 6 编辑器的值
 * @param view： codemirror 6 的 EditorView
 * @param content： 内容
 */
const setValue = (view: EditorView, content: string) => {
  view && view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: content } })
}

// 初始化输入框的值
post('/file', {
  "type": "getConfig"
}).then((response) => {
  response.json().then((data) => {
    setValue(view, data.hotkey_code)
  }).catch(console.error)
}).catch(console.error)

// ----------------------- 页面按钮 -----------------------

const hotkeyBtn = document.getElementById('get-hotkey')
const form = document.getElementById('form') as HTMLFormElement

document.getElementById('help').addEventListener('click', () => {
  const html = `
  <h4>👩‍💻 基本使用</h4>
  <p>1.点击「新建」以获取一段 ahk 代码；</p>
  <p>2.复制代码后粘贴到输入框；</p>
  <p>3.点击「保存」。</p>
  `

  createHelpMenu(html)
})

document.getElementById('create-code').addEventListener('click', () => {
  const dialog = document.getElementById('dialog') as HTMLDialogElement
  dialog.open = true
  initCreateCodeSelect()
})

hotkeyBtn.addEventListener('click', () => {
  recordSequence()
})

// 点「复制」按钮时，生成 ahk 代码并复制到剪贴板
form.addEventListener('submit', (event) => {
  event.preventDefault()

  // 获取按钮的 data-code、文字
  const code = hotkeyBtn.dataset.code
  const text = hotkeyBtn.innerText
  // 获取下拉框的值
  const selectValue = (document.getElementById('task-select') as HTMLSelectElement).value
  // 获取两个 input 的值
  const signal = getFormData(form)

  // 生成 ahk 代码
  const runTask = `runTask(\'${selectValue}\')`
  const sendSignal = `sendSignal(\'${signal.name}\', \'${signal.content}\')`
  let ahkCode = ''

  if (code == '') {
    // @ts-ignore
    new LightTip('没有输入快捷键', 1200, 'error')
  } else if (selectValue == '') {
    // @ts-ignore
    new LightTip('没有选择任务', 1200, 'error')
  } else if (signal.name == '') {
    ahkCode = `; ${text}\n` +
      code.replace('runTask', runTask).replace('sendSignal', '')
  } else {
    ahkCode = `; ${text}\n` +
      code.replace('runTask', runTask).replace('sendSignal', sendSignal)
  }

  if (ahkCode) {
    // 使用Clipboard API复制文本到剪贴板中
    navigator.clipboard.writeText(ahkCode).then(() => {
      // @ts-ignore
      new LightTip('复制成功 😃', 1200, 'success')
    }).catch((err) => {
      // @ts-ignore
      new LightTip('未知错误，复制失败 😢', 1200, 'error')
    })
  }
})

document.getElementById('save').addEventListener('click', (event) => {
  // 获取编辑器的值
  const content: string = view.state.doc.toString()

  // 保存配置
  post('/file', {
    "type": "saveConfig",
    "code": content
  })

  updataStarter()
})

// ----------------------- 初始化生成代码界面 -----------------------

// 初始化生成代码界面的下拉框
const initCreateCodeSelect = () => {
  post('/file', {
    "type": "fileList"
  }).then((response) => {
    if (!response) return
    response.json().then((data) => {

      if (Object.keys(data).length === 0) return

      const select = document.getElementById('task-select')
      let optionHTML = ''

      for (let key in data) {
        const testListHTML = data[key].reduce((html, list) => {
          const lastIndex = list.lastIndexOf('\\')
          let testName = list.slice(lastIndex + 1).replace('.js', '')
          // 任务名字数多于13，则截取并加上省略号
          if (testName.length > 13) testName = testName.substring(0, 13) + '...';

          html += `<option value="${list}">${testName}</option>`
          return html
        }, '')

        const lastIndex = key.lastIndexOf('\\')
        key = key.slice(lastIndex + 1)

        optionHTML += `
        <optgroup label="📂 ${key}">
        ${testListHTML}
        </optgroup>`
      }
      optionHTML = `${optionHTML}`
      select.innerHTML = optionHTML

    }).catch(e => console.log('请求错误', e))
  }).catch(e => console.log('请求错误', e))
}

// 记录用户输入的快捷键
const recordSequence = () => {
  Mousetrap.record(function (sequence: string[]) {
    // sequence 是一个数组，类似 ['ctrl+k', 'c']    
    const code = createAhkHotkey(sequence)
    const hotkeyBtn = document.getElementById('get-hotkey')

    if (code === '不支持该快捷键') {
      hotkeyBtn.innerHTML = '不支持该快捷键'
      hotkeyBtn.setAttribute("data-code", '')
    } else {
      hotkeyBtn.innerHTML = '快捷键: "' + sequence.join('" + "') + '"'
      hotkeyBtn.setAttribute("data-code", code)
    }
  })
}