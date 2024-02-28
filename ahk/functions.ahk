#Requires AutoHotkey v2.0

;====================工具====================
; 标准输出
std(result){
  std := FileOpen("*", "w", "UTF-8")
  std.Write(result)
  std.Close()
}

;====================应用====================
/**
 * target: 应用名称
 * options: 应用参数
*/
openApplication(target){
  if(target != "null") {
    Run("*RunAs " target)
  }
}

openUrl(url){
  if(url != "null") {
    Run(url)
  }
}

/**
 * name: lnk文件名称
 * target: 目标文件路径
 * path: 生成到
*/
createShortcut(name, target, path){
  if(target != "null") {
    if(name = "null"){
      ; 取出路径最后一部分，即文件名
      RegExMatch(target, ".*\\(.*)$", &OutputVar)
      name:= OutputVar[1]
      ; 将 .exe 替换为 .lnk
      shortcut_name := RegExReplace(name, "(.exe)$", ".lnk")
    } else {
      shortcut_name:= name ".lnk"
    }

    if(path = "null"){
      FileCreateShortcut(target, A_Desktop '\' shortcut_name)
    } else {
      FileCreateShortcut(target, path '\' shortcut_name)
    }
  }
}

allWinId(){
  ids := WinGetList(,, "Program Manager"), txt:=''
  ; 将 ahk 数组转为 js 数组的字符串形式
  for this_id in ids
  {
    txt:= this_id ',' txt
  }
  arr := '[' RegExReplace(txt, "(,)$", "]")

  res := "`{`n" 
  . "`"窗口id`":" arr "`n"
  . "`}"

  return res
}

curWinId(){
  ids := WinGetList(,, "Program Manager"), txt:=''
  for this_id in ids
  {
    if(WinActive(this_id)){
      txt := this_id
      Break
    }
  }

  ; res := "`{`n" 
  ; . "`'当前窗口id`':`'" txt "`',`n"
  ; . "`}"

  res := txt

  return res
}

winInfo(this_id){
  ; 将 id 字符串转为数字。作为函数参数时，字符串与数字不等价
  id_num := Integer(this_id)
  t1 := WinGetTitle(id_num), t2 := WinGetClass(id_num)
  t3 := WinGetProcessName(id_num), t4 := WinGetPID(id_num)
  t5 := WinGetProcessPath(id_num)

  t5 := StrReplace(t5, "\", "\\")

  res := "`{`n" 
  . "`"title`":`"" t1 "`",`n"
  . "`"class`":`"" t2 "`",`n"
  . "`"exe`":`"" t3 "`",`n"
  . "`"pid`":`"" t4 "`",`n"
  . "`"进程路径`":`"" t5 "`"`n"
  . "`}"

  return res
}

transparency(this_id, transparency){
  if (transparency = "null") {
    transparency := 255
  }
  if(transparency>255){
    transparency:=255
  } else if(transparency<0){
    transparency:=0
  }
  WinSetTransparent(Number(transparency), Number(this_id))
}

changeWin(this_id){
  WinActivate(Number(this_id))
}

winState(this_id, state){
  switch state {
  case "normal":
    WinRestore(Number(this_id))
  case "min":
    WinMinimize(Number(this_id))
  case "max":
    WinMaximize(Number(this_id))
  case "close":
    WinClose(Number(this_id))
  case "pin":
    WinSetAlwaysOnTop(-1, Number(this_id))
  }
}

prevWin(){
  Send("!{Tab}")
}

;====================键鼠操作====================
inputWord(text){
  if(text != "null") {
    SendText(text)
  }
}

inputKey(text){
  if(text != "null") {
    SendInput(text)
  }
}

getMouseInfo(){
  CoordMode "Mouse", "Screen"
  MouseGetPos &msX, &msY, &msWin, &msCtrl, 2
  mClr := PixelGetColor(msX,msY,"RGB")
  mClr := SubStr(mClr, 3)
  t1 := WinGetTitle(msWin), t2 := WinGetClass(msWin)
  t3 := WinGetProcessName(msWin), t4 := WinGetPID(msWin)
  t5 := WinGetProcessPath(msWin)
  t5 := StrReplace(t5, "\", "\\")
  t6 := msWin

  res := "`{`n"
  . "`"xy`":`"`(" msX "," msY "`)`",`n"
  . "`"颜色`":`"" "#" mClr "`",`n"
  . "`"窗口标题`":`"" t1 "`",`n"
  ; . "`"窗口class`":`"" t2 "`",`n"
  ; . "`"进程名`":`"" t3 "`",`n"
  ; . "`"pid`":`"" t4 "`",`n"
  . "`"进程路径`":`"" t5 "`",`n"
  . "`"窗口id`":`"" t6 "`"`n"
  . "`}"

  return res
}

;====================系统====================
shutdown(state){
  switch state {
  case "shutdown":
    Shutdown(1)
  case "restart":
    Shutdown(2)
  case "sleep":
    DllCall("PowrProf\SetSuspendState", "Int", 1, "Int", 0, "Int", 0)
  }
}

notice(content, title){
  TrayTip(content, title)
}

getTime(){
  年 := FormatTime(A_Now, "yyyy")
  月 := FormatTime(A_Now, "MM")
  日 := FormatTime(A_Now, "dd")
  小时 := FormatTime(A_Now, "HH")
  分 := FormatTime(A_Now, "mm")
  秒 := FormatTime(A_Now, "ss")

  res := "`{`n" 
  . "`"年`":`"" 年 "`",`n"
  . "`"月`":`"" 月 "`",`n"
  . "`"日`":`"" 日 "`",`n"
  . "`"小时`":`"" 小时 "`",`n"
  . "`"分`":`"" 分 "`",`n"
  . "`"秒`":`"" 秒 "`"`n"
  . "`}"

  return res
}

getDiskInfo(){
  arr := StrSplit(DriveGetList(), "")
  硬盘 := ""
  for this_item in arr
  {
    硬盘 := 硬盘
    .= "`"" this_item "盘总空间`":`"" Round(DriveGetCapacity(this_item ":\")/1024, 1) "`",`n"
    . "`"" this_item "盘剩余空间`":`"" Round(DriveGetSpaceFree(this_item ":\")/1024, 1) "`",`n"
  }

  硬盘 := SubStr(硬盘, 1, StrLen(硬盘) - 2) "`n"

  res := "`{`n" 
  . String(硬盘)
  . "`}"

  return res
}

getOsInfo(){
  arr := StrSplit(DriveGetList(), ""),
  bitOs := ""
  if(A_Is64bitOS){
    bitOs := "64 位"
  } else {
    bitOs := "32 位"
  }
  res := "`{`n"
  . "`"Windows 版本`":`"" A_OSVersion "`",`n"
  . "`"Windows 位数`":`"" bitOs "`",`n"
  . "`"分辨率`":`"" A_ScreenWidth '×' A_ScreenHeight "`",`n"
  . "`"当前音量`":`"" Round(SoundGetVolume(), 0) "%" "`"`n"
  . "`}"

  return res
}

volumeCtrl(vol){
  SoundSetVolume(vol)
}

switchPrevWin(){
  ; win 10 快捷键 alt + esc
  Send("!{esc}")
}

;====================文字====================
delText(num){
  Loop(num) {
    Send("{Backspace}")
  }
}

inputText(str){
  Send("{Raw}" str)
}

wToClipboard(str){
  A_Clipboard := str
}

clearClipboard(){
  A_Clipboard := ""
}

getClipboard(){
  res := String(A_Clipboard)
  return res
}

getSelectedText(){
  ; 保存剪贴板已有的内容
  clipboard_saved := A_Clipboard
  ; 清空剪贴板内容
  A_Clipboard := ""
  Send("^c")
  ClipWait(0.08)
  select_text := A_Clipboard
  ; 恢复之前的内容到剪贴板
  A_Clipboard := clipboard_saved
  ; 选中了文字
  if (select_text != "") {
    ; 根据结尾字符是否是回车来判断是否是由于 ctrl+c复制整行造成的
    ; 因为有的编辑器在不选中文字的情况下, 使用ctrl+c会复制一整行
    ; 这个判断方式在obsidian上无效, 即使obsidian复制了一整行, 最后一个字符也也不是换行符
    select_text_endchar := SubStr(select_text, -1, 1)
    if (select_text_endchar = "`n") {
      return
    }
  return select_text
}
return
}

;====================窗口====================
; 创建一个临时信息窗口，失去焦点后消失
msgWin(str){
  ; ==================== 基础设置 ====================

  str := RegExReplace(str, "\n", "`n") ; 将 js 的换行符改为 ahk 的
  oGui := Gui()
  oGui.Opt("+AlwaysOnTop -Caption +ToolWindow") ; 不显示标题栏
  oGui.SetFont("s12","微软雅黑")

  ; ==================== 设置窗口颜色、透明度、焦点 ====================

  winId := WinGetID(oGui)
  WinSetTransparent("230", winId) ; 窗口透明化
  WinActivate(winId) ; 聚焦窗口

  ; ==================== 设置窗口内容 ====================

  myCheckbox := oGui.Add("Checkbox","vCtrl_FollowMouse","钉在桌面上")
  myCheckbox.Value := 0
  myEdit := oGui.Add("Edit","w400 h180")
  myEdit.value := str
  oGui.Add("Text",,"")

  ; ==================== 监听窗口消息 ====================
  ; windows 消息参考列表 https://www.autoahk.com/archives/36777

  OnMessage(0x0201, WM_LBUTTONDOWN)

  WM_LBUTTONDOWN(wParam, lParam, msg, hwnd) { ; 使窗口可以移动
    PostMessage(0xA1, 2) 
  }

  ; 500ms 检查是否处于激活状态，没激活就销毁窗口
  SetTimer subroutine, 500
  subroutine()
  {
    if(myCheckbox.value){
    }
    else{
      if(!WinActive(winId)){
        oGui.Destroy()
        SetTimer subroutine, 0 ; 关闭计时器
      }
    }
  }

  ; ==================== 显示窗口 ====================

  CoordMode("Mouse", "Screen") ; 设置鼠标坐标模式为屏幕坐标
  MouseGetPos &mouseX, &mouseY
  op := "x" mouseX-15 " y" mouseY+10 "h230 w430"
  oGui.Show(op)
}

;====================任务启动器====================
; 执行任务 发起一个post请求 提供 js 文件路径
runTask(pa){
  API_URL := "http://127.0.0.1:5030/api/socket"
  HTTP_Request := ComObject("WinHttp.WinHttpRequest.5.1")
  HTTP_Request.Open("POST", API_URL, true)
  HTTP_Request.SetRequestHeader("Content-Type", "application/json")
  HTTP_Request.SetTimeouts(60000, 60000, 60000, 60000)

  ty := "runTask"
  pa := StrReplace(pa, "\", "\\")

  ; python 字典对应的字符串，最后一项结尾处不能有逗号，否则 py 会报错
  res := "`{`n" 
  . "`"type`":`"" ty "`",`n"
  . "`"path`":`"" pa "`"`n"
  . "`}"

  ; 会以字节字符串发送，记得在服务器端先将之转为普通字符串再转为json
  HTTP_Request.Send(res)
  HTTP_Request.WaitforResponse()
}

; 发送信号 发起一个post请求 提供信号名、信号内容
sendSignal(signal, data){
  API_URL := "http://127.0.0.1:5030/api/socket"
  HTTP_Request := ComObject("WinHttp.WinHttpRequest.5.1")
  HTTP_Request.Open("POST", API_URL, true)
  HTTP_Request.SetRequestHeader("Content-Type", "application/json")
  HTTP_Request.SetTimeouts(60000, 60000, 60000, 60000)

  ; 不用 signal 改用 sendData
  ty := "sendData"
  uuid := StrReplace(signal, "\", "\\")
  data := StrReplace(data, "\", "\\")

  ; python 字典对应的字符串，最后一项结尾处不能有逗号，否则 py 会报错
  ; res := "`{`n" 
  ; . "`"type`":`"" ty "`",`n"
  ; . "`"signal`":`"" signal "`"`n"
  ; . "`}"
  res := "`{`n" 
  . "`"type`":`"" ty "`",`n"
  . "`"uuid`":`"" uuid "`",`n"
  . "`"data`":`"" data "`"`n"
  . "`}"

  ; 会以字节字符串发送，记得在服务器端先将之转为普通字符串再转为json
  HTTP_Request.Send(res)
  HTTP_Request.WaitforResponse()
}

;====================右键托盘菜单====================
; 初始化右键菜单
InitTrayMenu() {
  A_TrayMenu.Delete()
  A_TrayMenu.Add("退出", TrayMenuHandler)
  A_IconTip := "启动器"
  TraySetIcon("./icons/logo.ico")
}

/**
 * 托盘菜单被点击
 * @param ItemName 
 * @param ItemPos 
 * @param MyMenu 
*/
TrayMenuHandler(ItemName, ItemPos, MyMenu) {
  switch ItemName {
  case "退出":
    ahkExit()
  }
}

ahkExit(ExitReason?, ExitCode?) {
  ProcessClose("启动器.ahk")
  ExitApp
}