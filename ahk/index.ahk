#Requires AutoHotkey v2.0

#NoTrayIcon
#Warn All, Off ; 禁用所有警告 搭配try使用效果更好
#ErrorStdOut ; 错误信息输出到标准输出
#SingleInstance Force
SetWorkingDir A_ScriptDir
#Include ./functions.ahk

try {
  ; js 用 post 向 ahk 发送的参数必须是字符串，不可以是数字
  funType := A_Args[1]

  switch funType {
    ; 应用
  case "openApplication":
    openApplication(A_Args[2])
  case "openUrl":
    openUrl(A_Args[2])
  case "createShortcut":
    createShortcut(A_Args[2], A_Args[3], A_Args[4])
  case "allWinId":
    result := allWinId()
    std(result)
  case "curWinId":
    result := curWinId()
    std(result)
  case "winInfo":
    result := winInfo(A_Args[2])
    std(result)
  case "transparency":
    result := transparency(A_Args[2], A_Args[3])
  case "changeWin":
    result := changeWin(A_Args[2])
  case "winState":
    result := winState(A_Args[2], A_Args[3])
  case "switchPrevWin":
    switchPrevWin()

    ; 键鼠操作
  case "inputWord":
    inputWord(A_Args[2])
  case "inputKey":
    inputKey(A_Args[2])
  case "getMouseInfo":
    result := getMouseInfo()
    std(result)

    ; 系统
  case "shutdown":
    shutdown(A_Args[2])
  case "notice":
    A_IconHidden := false
    notice(A_Args[2], A_Args[3])
    A_IconHidden := true
  case "getTime":
    result := getTime()
    std(result)
  case "getDiskInfo":
    result := getDiskInfo()
    std(result)
  case "getOsInfo":
    result := getOsInfo()
    std(result)
  case "volumeCtrl":
    volumeCtrl(A_Args[2])

    ; 文字
  case "delText":
    delText(A_Args[2])
  case "inputText":
    inputText(A_Args[2])
  case "wToClipboard":
    wToClipboard(A_Args[2])
  case "clearClipboard":
    clearClipboard()
  case "getClipboard":
    result := getClipboard()
    std(result)
  case "getSelectedText":
    result := getSelectedText()
    std(result)

    ; 窗口
  case "msgWin":
    msgWin(A_Args[2])

  }
} 
catch as e 
{
  ; 2s 后自动关闭
  MsgBox("发生错误，你提供的参数可能不对`n" e.Message, "源核", "T2")
  Exit
}