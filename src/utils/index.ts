import { GraphNodeLayout } from '../GraphicProgramming/graph_node_layout'
import 'lu2/theme/edge/css/common/ui.css';
import 'lu2/theme/edge/js/common/all.js';

export const http = 'http://127.0.0.1:5030/api'

// ----------------------- 通用工具函数 -----------------------

/** 封装 post 请求
 * @param api 例子：/py
 * @param data data 字段，请求的数据主体
 * @example data 模板：
 * {
 *  "type": "openApp",
 *  依次填入 ahk 函数所需参数,
 *  ...
 * }
 */
export const post = async (api: string, data = {}) => {
  try {
    // 超过 20000 ms 时终止请求。参考 https://juejin.cn/post/7168381678161756168
    const controller = new AbortController()
    const timer = setTimeout(() => {
      // 当 abort() 被调用，fetch() promise 将会抛出一个 AbortError ，以终止请求
      controller.abort()
    }, 20000)

    const response = await fetch(http + api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      // 将JavaScript对象或值转换为JSON字符串
      body: JSON.stringify(data),
      // 将信号绑定在请求信息中，以在发起终止请求时终止
      signal: controller.signal
    })

    // 处理响应状态在 200-299 范围之外。参考 https://juejin.cn/post/7126441823584649224
    if (!response.ok) {
      const message = `请求发生错误: ${response.status}`;
      throw new Error(message);
    }

    clearTimeout(timer)

    // const result = await response.json();  // 解析成对象
    // console.log(result)
    return response

  } catch (error) {
    console.error('请求发生错误:', error)
  }
}

/** 输入值为数字时，加双引号，使之成为文本 */
export const addQuotationMarksForNumber = (str: string) => {
  if (/^-{0,1}[0-9]+\.{0,1}[0-9]*e{0,1}\+*[0-9]*$/.test(str)) {
    str = `"${str}"`
  }
  if (/^(0x[a-fA-F0-9]+)|(0b[0-1]*)|(0o[0-7]*)$/.test(str)) {
    str = `"${str}"`
  }
  return str;
}

/** 将 obj 编码，方便传输 */
export const encodeObj = (obj: object) => {
  let str = JSON.stringify(obj)
  str = encodeURIComponent(str)
  return str
}

/** 解码回 obj */
export const decodeObj = (str: string) => {
  const obj = JSON.parse(decodeURIComponent(str)) as Object
  return obj
}

/** 打开消息框 dialog。基于 niva */
export const openDialog = (title: string) => {
  Niva.api.dialog.showMessage(title, '你好', 'warning');
}

/** 生成时间戳 */
export const generateTimestamp = () => {
  const currentDate = new Date()

  const month = currentDate.getMonth() + 1 // 由于月份从0开始，因此需加1
  const day = currentDate.getDate()
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes()
  const seconds = currentDate.getSeconds()

  const timestamp = `${month}${day}${hours}${minutes}${seconds}`
  return timestamp
}

// ----------------------- 主窗口 -----------------------

/** 创建主界面的设置菜单 */
export const createSettingsMenu = () => {
  const parentNode = document.getElementById('g-menu')
  parentNode.innerHTML = `<div id="m-menu" class="m-menu">
      <div class="m-menu-content">
        <div class="u-menu-title">设置</div>
        <div class="u-item">
          <div>工作路径</div>
          <input id="u-input-path" class="u-input"></input>
        </div>
        <div id="u-save">
          <button>保存</button>
        </div>
      </div>
    </div>`

  const menu = document.getElementById('m-menu')
  const saveBtn = document.getElementById('u-save')
  const pathInput = document.getElementById('u-input-path') as HTMLInputElement

  // 初始化输入框的值
  post('/file', {
    "type": "getConfig"
  }).then((response) => {
    response.json().then((data) => {
      pathInput.value = data.file_path
    }).catch(console.error)
  }).catch(console.error)

  // 点击空白处关闭菜单
  menu.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if ((target.parentNode as HTMLElement).id === 'g-menu') {
      parentNode.innerHTML = ""
    }
  })

  saveBtn.addEventListener('click', (e) => {
    const path = pathInput.value
    post('/file', {
      "type": "saveConfig",
      "path": path
    })
  })
}

/** 渲染主界面的任务卡片列表 */
export const renderListHTML = (data) => {
  const testList = document.getElementById('m-test-card')
  let cardHTML = ''
  if (Object.keys(data).length === 0) return testList.innerHTML = cardHTML
  
  for (let key in data) {
    const testListHTML = data[key].reduce((html, list) => {
      const lastIndex = list.lastIndexOf('\\')
      let testName = list.slice(lastIndex + 1).replace('.js', '')
      // 任务名字数多于13，则截取并加上省略号
      if (testName.length > 13) testName = testName.substring(0, 13) + '...';

      html += `<div class="u-long-button">
          <i></i>
          <button data-path="${list}">${testName}</button>
        </div>`
      return html
    }, '')

    const lastIndex = key.lastIndexOf('\\')
    key = key.slice(lastIndex + 1)

    cardHTML += `<div class="m-card">
        <div class="m-name">
          <p>${key}</p>
          <div class="visible m-visible"></div>
        </div>
        <div class="m-buttons m-long-buttons">
          ${testListHTML}
        </div>
      </div>`
  }
  cardHTML = `${cardHTML}`
  testList.innerHTML = cardHTML
}

/** 更新任务列表 */
export const updateTaskList = () => {
  // 0 是主窗口的 id
  Niva.api.window.sendMessage(encodeObj({
    "type": "updateTaskList"
  }), 0)
}

/** 更新启动器 */
export const updataStarter = () => {
  // 0 是主窗口的 id
  Niva.api.window.sendMessage(encodeObj({
    "type": "updataStarter"
  }), 0)
}

// ----------------------- form 窗口 -----------------------

/** 创建 form 文本 */
export const fromText = (content: string) => {
  if (content === undefined) content = ""
  if (content === null) content = ""
  let html = `<div class="form-text">${content}</div>`
  return html
}

/** 创建 form 输入框、多行文本框 */
// 用遍历时的索引作为名字即可
export const fromInput = (type: string, name: string | number, content?: string) => {
  if (content === undefined) content = ""
  if (content === null) content = ""
  let html = ""
  switch (type) {
    case '输入框':
      html += `<input class="form-input" name=${name} type="text" value="${content}"/>`
      break
    case '多行文本框':
      html += `<textarea class="form-textarea" name=${name} type="text">${content}</textarea>`
      break
  }
  return html
}

/** 创建 form 选择 */
export const fromSelect = (type: string, name: string | number, content: []) => {
  if (content === undefined) return []
  if (content === null) return []
  let html = ""
  switch (type) {
    case '单选':
      content.forEach(item => {
        html += `<input type="radio" name=${name} value=${item}>${item}`
      })
      html = `<div class="form-radio">` + html + `</div>`
      break
    case '多选':
      content.forEach(item => {
        html += `<input type="checkbox" name=${name} value=${item}>${item}`
      })
      html = `<div class="form-radio">` + html + `</div>`
      break
    case '下拉列表':
      content.forEach(item => {
        html += `<option>${item}</option>`
      })
      html = `<select class="form-select" size="1" name=${name}>` + html + `</select>`
      break
  }
  return html
}

/** 创建 form
 * @param typeList 子项类型的列表
 * @param valueList 子项内容的列表
 * @param uuid
 */
export const fromCreate = (typeList: [], valueList: [], uuid: string) => {
  let html = ""
  typeList.forEach((type, i) => {
    switch (type) {
      case '文本':
        html += fromText(valueList[i])
        break
      case '输入框':
      case '多行文本框':
        html += fromInput(type, i, valueList[i])
        break
      case '单选':
      case '多选':
      case '下拉列表':
        html += fromSelect(type, i, valueList[i])
        break
    }
  })

  html = html
    + `<div class="form-buttons">`
    + `<button class="form-button" type="reset">重做</button>`
    + `<button class="form-button" id="form-submit" data-uuid="${uuid}" type="submit">确定</button>`
    + `</div>`

  return html
}

/** 获取 form 内容并返回对象 */
// 参考 https://zhuanlan.zhihu.com/p/342758498
export const getFormData = (form: HTMLFormElement): any => {
  const jsondata = {};
  const formdata = new FormData(form);
  formdata.forEach((value, key) => {
    if (!jsondata[key]) {
      jsondata[key] = formdata.getAll(key).length > 1 ? formdata.getAll(key) : formdata.get(key);
    }
  });
  return jsondata;
}

// ----------------------- 可视化编程窗口 -----------------------

/** 生成任务列表 基于 lulu ui 库 */
const getTaskList = (data) => {
  let tableHtml = `
  <div class="table-x">
    <button class="newBuilt" data-type="newBuilt">➕︎</button>
  </div>`
  if (Object.keys(data).length === 0) return tableHtml

  tableHtml = ''

  // key 是文件夹的路径
  // console.log(data)
  for (let key in data) {
    const testListHTML = data[key].reduce((html, list) => {
      const lastIndex = list.lastIndexOf('\\')
      let testName = list.slice(lastIndex + 1).replace('.js', '')
      // 任务名字数多于13，则截取并加上省略号
      if (testName.length > 13) testName = testName.substring(0, 13) + '...';

      html += `
      <tr>
        <td class="td-testName">${testName}</td>
        <td>
          <button class="menu-button del-button" data-path="${list}">删除</button>
          <button class="menu-button" data-path="${list}">编辑</button>
          <button class="menu-button" data-path="${list}">重命名</button>
          <button class="menu-button" data-path="${list}">修改分组</button>
        </td>
      </tr>
      `
      return html
    }, '')

    // 任务分组
    const lastIndex = key.lastIndexOf('\\')
    let taskGroup = key.slice(lastIndex + 1)

    tableHtml += `
    <tr>
      <td class="td-taskGroup">📂${taskGroup}</td>
      <td>
        <button class="menu-button del-button" data-path="${key}" data-type="taskGroup">删除</button>
        <button class="menu-button" data-path="${key}" data-type="taskGroup">重命名</button>
      </td>
    </tr>
    ${testListHTML}`
  }
  tableHtml = `
  <div class="table-x">
    <table class="ui-table">
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
    <button class="newBuilt" data-type="newBuilt">➕︎</button>
  </div>`
  return tableHtml
}

/** 生成 Dialog 基于 lulu ui 库
 * @param title 标题
 * @param content 提供 html
 * @param callback 点击确定按钮的回调函数
 */
export const createDialog = (title?: string, content?: string, callback?: Function) => {
  //@ts-ignore
  let eleDialog = new Dialog({
    title: title,
    content: content,
    buttons: [{
      value: '确定',
      className: 'menu-button dialog-button',
      events: function (event) {
        if (callback) callback()
        event.dialog.remove()
      }
    }, {
      value: '取消',
      className: 'menu-button dialog-button',
    }]
  })
  return eleDialog
}

/** 生成下拉列表 基于 lulu ui 库 
 * @param option 下拉列表文字
 * @param selected 默认选中的文字
 * */
const createSelect = (option: Array<string>, selected?: string) => {
  let html = ``
  option.forEach(item => {
    if (item !== selected) html += `<option value="${item}">${item}</option>`
    else html += `<option value="${item}" selected>${item}</option>`
  })
  return `
  <select id="groupSelect" is="ui-select" width="100%">
    ${html}
  </select>`
}

// 存储正在编辑的任务对应的 json 文件路径
export let taskPath = ''

export const setTaskPath = (path: string) => {
  taskPath = path
}

/** 创建管理菜单 基于 lulu ui 库
 * @param layout 可视化编程编辑器实例
 */
export const createManageMenu = (layout: GraphNodeLayout) => {
  post('/file', {
    "type": "fileList"
  }).then((response) => {
    if (!response) return
    response.json().then((data) => {
      let html = getTaskList(data)
      // 存储任务对应文件的路径

      //@ts-ignore
      let eleDialog = new Dialog({
        title: '管理菜单',
        width: '97%',
        height: 'stretch',
        content: `${html}`,
        onRemove: () => {
          updateTaskList()
        }
      })
      eleDialog.addEventListener('click', (event) => {
        event.preventDefault()

        // 获取按钮上的文字、存储的路径
        const { dataset, tagName, innerText } = event.target as HTMLElement
        if (tagName === "BUTTON") {
          let path = dataset.path
          // 如果 type = 'taskGroup' ，则表示是分组的按钮
          // 如果 type = 'newBuilt' ，则表示是新建分组、任务的按钮
          let type = dataset.type

          let fun: Function = () => { }
          let taskGroup: Array<string> = [] // 存储所有的分组名
          let taskGroupPath: Array<string> = [] // 存储所有的分组路径
          let name: string = '' // 任务或分组的名字
          let html: string = ''

          switch (innerText) {
            case '删除':
              fun = () => {
                post('/file', {
                  "type": "deleteFile",
                  "path": path
                }).then((response) => {
                  // 如果删除的是任务，则还需要删除任务对应的 json 文件
                  if (!type) {
                    post('/file', {
                      "type": "deleteFile",
                      "path": path + 'on'
                    })
                  }
                  eleDialog.remove()
                  createManageMenu(layout)
                })
              }
              createDialog('🗑️ ' + innerText, `
                <div>确定删除？删除后将不可恢复</div>
              `, fun)
              break;
            case '编辑':
              // 导入 json
              fun = () => {
                post('/file', {
                  "type": "readFile",
                  "path": path + 'on'
                }).then((response) => {
                  response.json().then((data) => {
                    layout.import(data) // 导入到画布中
                  }).catch(e => console.log('导入错误', e))
                }).catch(e => console.log('导入错误', e))
                taskPath = path + 'on'
                eleDialog.remove()
              }
              createDialog('✍ ' + innerText, `
                <div>将该任务导入到画布以编辑，编辑后请手动保存</div>
              `, fun)
              break;
            case '重命名':
              name = path.slice(path.lastIndexOf('\\') + 1).replace('.js', '')

              fun = () => {
                const reg = new RegExp("(" + name + ")(?!.*" + name + ")")
                const inputValue = (document.getElementById('renameInput') as HTMLInputElement).value
                const newPath = path.replace(reg, inputValue)

                post('/file', {
                  "type": "renameFile",
                  "path": path,
                  "newPath": newPath
                }).then((response) => {
                  // 如果正在编辑的任务与重命名的任务相同，则需要修改 taskPath
                  if (taskPath.indexOf(path) === 0) taskPath = taskPath.replace(path, newPath)
                  // 如果重命名的是任务，则还需要重命名任务对应的 json 文件
                  if (!type) {
                    post('/file', {
                      "type": "renameFile",
                      "path": path + 'on',
                      "newPath": newPath + 'on'
                    })
                    if (taskPath == (path + 'on')) taskPath = newPath + 'on'
                  }
                  eleDialog.remove()
                  createManageMenu(layout)
                })
              }
              createDialog('🏷️ ' + innerText, `
                <input id="renameInput" class="ui-input" value="${name}">
              `, fun)
              break;
            case '修改分组':
              // 获取旧的分组名
              const nameArr = path.split(/\\/)
              const oldGroup = nameArr[nameArr.length - 2]

              // 生成下拉列表
              for (let key in data) {
                taskGroup.push(key.slice(key.lastIndexOf('\\') + 1))
              }
              html = createSelect(taskGroup, oldGroup)

              fun = () => {
                // 获取新的分组名
                const selectValue = (document.getElementById('groupSelect') as HTMLSelectElement).value
                nameArr[nameArr.length - 2] = selectValue
                const newPath = nameArr.join('\\')

                // 移动 js 文件
                post('/file', {
                  "type": "moveFile",
                  "path": path,
                  "newPath": newPath
                }).then(res => {
                  // 移动 json 文件
                  post('/file', {
                    "type": "moveFile",
                    "path": path + 'on',
                    "newPath": newPath + 'on'
                  })

                  if (taskPath.indexOf(path) === 0) taskPath = taskPath.replace(path, newPath)
                  eleDialog.remove()
                  createManageMenu(layout)
                })
              }
              createDialog('📂 ' + innerText, `${html}`, fun)
              break;
            case '➕︎':
              // 新建任务或分组
              // 生成下拉列表
              for (let key in data) {
                taskGroupPath.push(key)
                taskGroup.push(key.slice(key.lastIndexOf('\\') + 1))
              }
              taskGroup.push('新建分组')

              // 生成一个对象，对象格式 { 分组名: 分组路径 }
              const taskGroupObj = taskGroup.reduce((acc, cur, index) => {
                acc[taskGroup[index]] = taskGroupPath[index];
                return acc;
              }, {})
              html = `
                <div>任务名</div>
                  <input id="renameInput" class="ui-input" value="${name}">
                <div>选择分组</div>
              ` + createSelect(taskGroup)

              fun = () => {
                const inputValue = (document.getElementById('renameInput') as HTMLInputElement).value
                const selectValue = (document.getElementById('groupSelect') as HTMLSelectElement).value
                const newDirName = '未命名分组' + generateTimestamp()

                if (inputValue == '') name = '未命名任务' + generateTimestamp()
                else name = inputValue

                if (selectValue == '新建分组') {
                  post('/file', {
                    "type": "getConfig"
                  }).then((response) => {
                    response.json().then((data) => {
                      // 获取工作路径
                      const path = data.file_path
                      // 新建一个分组
                      post('/file', {
                        "type": "newFile",
                        "name": newDirName,
                        "path": path,
                        "isDir": true,
                        "content": ''
                      }).then((response) => {
                        // 创建任务
                        post('/file', {
                          "type": "newFile",
                          "name": name + '.js',
                          "path": path + '\\' + newDirName,
                          "isDir": false,
                          "content": ''
                        }).then(res => {
                          eleDialog.remove()
                          createManageMenu(layout)
                        })
                        post('/file', {
                          "type": "newFile",
                          "name": name + '.json',
                          "path": path + '\\' + newDirName,
                          "isDir": false,
                          "content": '{"nodes":[],"lines":[],"margin":{"left":"0px","top":"0px"}}'
                        })
                      })
                    }).catch(console.error)
                  }).catch(console.error)
                } else {
                  // 创建任务
                  post('/file', {
                    "type": "newFile",
                    "name": name + '.js',
                    "path": taskGroupObj[selectValue],
                    "isDir": false,
                    "content": ''
                  }).then(res => {
                    eleDialog.remove()
                    createManageMenu(layout)
                  })
                  post('/file', {
                    "type": "newFile",
                    "name": name + '.json',
                    "path": taskGroupObj[selectValue],
                    "isDir": false,
                    "content": '{"nodes":[],"lines":[],"margin":{"left":"0px","top":"0px"}}'
                  })
                }
              }
              createDialog('➕︎ 新建任务', `${html}`, fun)
              break;
            default:
              break
          }
        }
      })

    }).catch(e => console.log('请求错误', e))
  }).catch(e => console.log('请求错误', e))
}

/** 创建帮助菜单 基于 lulu ui 库  */
export const createHelpMenu = (html: string) => {
  //@ts-ignore
  new Dialog({
    title: '📙 帮助',
    width: '60%',
    height: 'stretch',
    content: `${html}`
  })
}

// ----------------------- 设置快捷键 -----------------------

/** 按照 ahk 的规矩处理键名  */
const handleKeyName = (keyName: string): string => {
  // 检查是否为有效的键，不是直接退出
  const ValidKey: Array<string> = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'esc', 'tab', 'capslock', 'shift', 'ctrl', 'meta', 'alt', 'space', 'backspace', 'enter',
    'ins', 'del', 'home', 'end', 'pageup', 'pagedown',
    'up', 'down', 'left', 'right',
    '+', '-', '*', '/', '=', '[', ']', '\\', ';', '\'', ',', '.', '//'
  ]
  if (!ValidKey.includes(keyName)) {
    return '不支持该快捷键'
  }

  // 需要处理的键
  switch (keyName) {
    case 'meta': // win 键
      return '#'
    case 'alt':
      return '!'
    case 'ctrl':
      return '^'
    case 'shift':
      return '+'

    case 'pageup':
      return 'PgUp'
    case 'pagedown':
      return 'PgDn'

    case '+':
      return 'NumpadAdd'
    case '-':
      return 'NumpadSub'
    case '*':
      return 'NumpadMult'
    case '/':
      return 'NumpadDiv'
  }

  return keyName
}

/** 提供键位，生成 ahk 快捷键代码  */
export const createAhkHotkey = (hotkeyArr: Array<string>) => {
  let code: string = '不支持该快捷键'
  let newKeyName: string = ''

  // 暂时不支持类似 ctrl + a + b 的快捷键注册
  if (hotkeyArr.length === 1) {
    // 单键 eg：s
    // 没有 + ，或者只有一个 + ，表示是单键
    if (!hotkeyArr[0].includes('+') || hotkeyArr[0] === '+') {
      newKeyName = handleKeyName(hotkeyArr[0])
      code = `\n
      ${newKeyName}::{
        runTask
        sendSignal
      }\n`
    } else {
      // 修饰键 eg：ctrl + s、ctrl + alt + s
      for (const key of hotkeyArr[0].split('+')) {
        newKeyName += handleKeyName(key)
      }
      code = `\n
      ${newKeyName}::{
        runTask
        sendSignal
      }\n`
    }
  }
  return code.trim()
}
