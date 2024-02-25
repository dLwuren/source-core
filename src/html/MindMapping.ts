// 项目地址 https://github.com/wanglin2/mind-map
import MindMap from "simple-mind-map";
import '../static/MindMapping.css'

import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import KeyboardNavigation from 'simple-mind-map/src/plugins/KeyboardNavigation.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'

import { post, decodeObj } from "../utils/index"

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

// ----------------------- 初始化 -----------------------

// 注册插件
MindMap.usePlugin(Drag)
MindMap.usePlugin(Select)
MindMap.usePlugin(KeyboardNavigation)
MindMap.usePlugin(Export)
MindMap.usePlugin(AssociativeLine) // 关联线插件

// 思维导图主题
MindMap.defineTheme('默认主题', {
  // 背景颜色
  backgroundColor: 'rgb(241,241,241)',
})

const mindMap = new MindMap({
  // @ts-ignore
  el: document.getElementById('mindMapContainer'),
  enableFreeDrag: false,
  theme: '默认主题',
  data: {
    "data": {
      "text": "根节点"
    },
    "children": []
  }
});

// 根节点默认激活 操作不能频繁，要少量延时
setTimeout(() => {
  mindMap.renderer.addNodeToActiveList(mindMap.renderer.root)
}, 20)

// ----------------------- 思维导图绑定事件 -----------------------

let activeNodes = []
let isRoot = false //激活节点是否为根节点
let isGeneralization = false //激活节点是否为概要节点

mindMap.on('node_active', (node, activeNodeList) => {
  activeNodes = activeNodeList
  // if (node) {
  //   console.log(node.nodeData)
  // }
  activeNodes.findIndex(node => {
    isRoot = node.isRoot
    isGeneralization = node.isGeneralization
  })
})

// setTimeout(() => {
//   mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
//     "text": "1"
//   })
//   // activeNodes[0].setText('12333')
//   setTimeout(() => {
//     console.log(activeNodes[0].setText('12333'))
//   }, 1000)
// }, 2000)

// ----------------------- 窗口通讯 -----------------------

Niva.addEventListener(
  "window.message",
  (eventName: string, payload: { from: number; message: string }) => {
    // console.log('接收信息')
    const { from, message } = payload
    const data = decodeObj(message)
    // console.log(data)

    switch (data["type"]) {
      case "addSubNode":
        // 在所有激活节点后面添加子节点
        if (isGeneralization) break
        mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
          "text": data["data"]
        })
        break
      case "addBroNode":
        // 在所有激活节点（除了根节点、概括节点）后面添加兄弟节点
        if (isRoot || isGeneralization) break
        mindMap.execCommand('INSERT_NODE', false, [], {
          "text": data["data"]
        })
        break
      case "getNodeUid":
        const nodeUid = activeNodes[0]?.uid
        if (nodeUid) {
          post('/socket', {
            "type": "sendData",
            "uuid": data["uuid"],
            "data": JSON.stringify(nodeUid)
          })
        }
        break
      case "getNodeInfo":
        if (!data["data"]) break
        const node = mindMap.renderer.findNodeByUid(data["data"])
        if (!node === null) break

        let info = {}

        activeNodes.forEach(node => {
          info = {
            "uid": node.uid,
            "父节点": node.parent.uid,
            "子节点": node.children.map(obj => obj.uid),
            "节点内容": node.nodeData.data.text,
            "节点层级": node.layerIndex,
          }
        })
        post('/socket', {
          "type": "sendData",
          "uuid": data["uuid"],
          "data": JSON.stringify(info)
        })
        break
      case "delNode":
        // 删除所有激活节点
        if (isRoot) break
        mindMap.execCommand('REMOVE_NODE')
        break
      case "changeNode":
        // 激活多个节点，也只修改1个
        activeNodes.forEach(node => {
          node.setText(data["data"])
        })
        break
    }
  }
);
