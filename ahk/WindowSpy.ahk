; 
; Window Spy for AHKv2
;

#Requires AutoHotkey v2.0

#NoTrayIcon
#SingleInstance Ignore
SetWorkingDir A_ScriptDir
CoordMode "Pixel", "Screen"

Global oGui

WinSpyGui()

WinSpyGui() {
  Global oGui

  try TraySetIcon "icons\源核logo.ico"
  DllCall("shell32\SetCurrentProcessExplicitAppUserModelID", "wstr", "AutoHotkey.WindowSpy")

  oGui := Gui("AlwaysOnTop Resize MinSize +DPIScale","窗口信息")
  oGui.OnEvent("Close",WinSpyClose)
  oGui.OnEvent("Size",WinSpySize)

  oGui.BackColor := "FFFFFF"
  oGui.SetFont('s9')

  oGui.Add("Text",,"窗口的信息")
  oGui.Add("Checkbox","yp xp+200 w120 Right vCtrl_FollowMouse","跟随鼠标变化").Value := 1
  oGui.Add("Edit","xm w320 r5 ReadOnly -Wrap vCtrl_Title")
  oGui.Add("Text",,"鼠标位置")
  oGui.Add("Edit","w320 r4 ReadOnly vCtrl_MousePos")

  ; "vCtrl_CtrlLabel" 是控件的名称或标识符，用于后续对该控件进行引用
  ; 将变量 txtFocusCtrl 的设置为文本内容
  oGui.Add("Text","w320 vCtrl_CtrlLabel",(txtFocusCtrl := "鼠标位置处的控件"))
  oGui.Add("Edit","w320 r4 ReadOnly vCtrl_Ctrl")
  oGui.Add("Text",,"活动窗口位置")
  oGui.Add("Edit","w320 r2 ReadOnly vCtrl_Pos")
  ; oGui.Add("Text",,"状态栏文本")
  ; oGui.Add("Edit","w320 r2 ReadOnly vCtrl_SBText")
  ; oGui.Add("Checkbox","vCtrl_IsSlow","Slow TitleMatchMode")
  ; oGui.Add("Text",,"可见文本")
  ; oGui.Add("Edit","w320 r2 ReadOnly vCtrl_VisText")
  ; oGui.Add("Text",,"所有文本")
  ; oGui.Add("Edit","w320 r2 ReadOnly vCtrl_AllText")
  oGui.Add("Text","w320 r1 vCtrl_Freeze",(txtNotFrozen := "(按住 Ctrl 或 Shift 暂停更新信息)"))

  oGui.Show("NoActivate")
  ; 获取窗口的客户区域的左上角坐标，并将其存储在 x_temp 和 y_temp2 变量中
  WinGetClientPos(&x_temp, &y_temp2,,,"ahk_id " oGui.hwnd)

  oGui.txtNotFrozen := txtNotFrozen ; create properties for futur use
  oGui.txtFrozen := "(信息已暂停更新)"
  oGui.txtMouseCtrl := "鼠标位置处的控件"
  oGui.txtFocusCtrl := txtFocusCtrl

  SetTimer Update, 250
}

WinSpySize(GuiObj, MinMax, Width, Height) {
  Global oGui

  If !oGui.HasProp("txtNotFrozen") ; WinSpyGui() not done yet, return until it is
    return

  SetTimer Update, (MinMax=0)?250:0 ; suspend updates on minimize

  ctrlW := Width - (oGui.MarginX * 2) ; ctrlW := Width - horzMargin
  list := "Title,MousePos,Ctrl,Pos,Freeze"
  ; ,SBText,VisText,AllText
  Loop Parse list, ","

  ; 拼接字符串 "Ctrl_" 和循环变量 A_LoopField 的值，获取了窗口中对应控件对象的引用
  oGui["Ctrl_" A_LoopField].Move(,,ctrlW)
}

WinSpyClose(GuiObj) {
  ExitApp
}

Update() { ; timer, no params
  Try TryUpdate() ; Try
}

TryUpdate() {
  Global oGui

  If !oGui.HasProp("txtNotFrozen") ; WinSpyGui() not done yet, return until it is
    return

  ; 将鼠标坐标模式设置为屏幕坐标模式，以使后续的鼠标操作可以以屏幕坐标为基准进行
  Ctrl_FollowMouse := oGui["Ctrl_FollowMouse"].Value
  CoordMode "Mouse", "Screen"
  MouseGetPos &msX, &msY, &msWin, &msCtrl, 2 ; get ClassNN and hWindow
  actWin := WinExist("A")

  if (Ctrl_FollowMouse) {
    curWin := msWin, curCtrl := msCtrl
    WinExist("ahk_id " curWin) ; updating LastWindowFound?
  } else {
    curWin := actWin
    curCtrl := ControlGetFocus() ; get focused control hwnd from active win
  }
  curCtrlClassNN := ""
  ; ControlGetClassNN, 返回指定控件的 ClassNN(类名和编号)
  Try curCtrlClassNN := ControlGetClassNN(curCtrl)

  t1 := WinGetTitle(), t2 := WinGetClass()
  if (curWin = oGui.hwnd || t2 = "MultitaskingViewFrame") { ; Our Gui || Alt-tab
    UpdateText("Ctrl_Freeze", oGui.txtFrozen)
    return
  }

  UpdateText("Ctrl_Freeze", oGui.txtNotFrozen)
  t3 := WinGetProcessName(), t4 := WinGetPID(), t5 := WinGetProcessPath()
  t5 := StrReplace(t5, "\", "\\")

  WinDataText := "标题: " t1 "`n"
  ; . "class: " t2 "`n"
  ; . "进程名(exe): " t3 "`n"
  ; . "进程号(pid): " t4 "`n"
  . "进程路径: " t5 "`n"
  . "窗口id: " curWin

  UpdateText("Ctrl_Title", WinDataText)
  CoordMode "Mouse", "Window"
  MouseGetPos &mrX, &mrY
  CoordMode "Mouse", "Client"
  MouseGetPos &mcX, &mcY
  mClr := PixelGetColor(msX,msY,"RGB")
  mClr := SubStr(mClr, 3)

  mpText := "鼠标在屏幕的位置:`t(" msX "," msY ")`n"
  ; . "鼠标在窗口的位置:`t(" mrX "," mrY ")`n"
  . "颜色:`t #" mClr " (Red=" SubStr(mClr, 1, 2) " Green=" SubStr(mClr, 3, 2) " Blue=" SubStr(mClr, 5) ")"

  UpdateText("Ctrl_MousePos", mpText)

  UpdateText("Ctrl_CtrlLabel", (Ctrl_FollowMouse ? oGui.txtMouseCtrl : oGui.txtFocusCtrl) ":")

  if (curCtrl) {
    ctrlTxt := ControlGetText(curCtrl)
    WinGetClientPos(&sX, &sY, &sW, &sH, curCtrl)
    ControlGetPos &cX, &cY, &cW, &cH, curCtrl

    cText := "控件的类名和编号(ClassNN):`n " curCtrlClassNN "`n"
    . "控件的文本:`n " textMangle(ctrlTxt) "`n"
    ; . "窗口的位置和大小:`tx: " sX "`ty: " sY "`tw: " sW "`th: " sH "`n"
    ; . "控件的位置和大小:`t(" cX "," cY ") w: " cW "`th: " cH
  } else
  cText := ""

  UpdateText("Ctrl_Ctrl", cText)
  wX := "", wY := "", wW := "", wH := ""
  WinGetPos &wX, &wY, &wW, &wH, "ahk_id " curWin
  WinGetClientPos(&wcX, &wcY, &wcW, &wcH, "ahk_id " curWin)

  wText := "窗口的左上角坐标、宽、高:`n (" wX "," wY ")`tw: " wW "`th: " wH "`n"
  ; . "Client:`tx: " wcX "`ty: " wcY "`tw: " wcW "`th: " wcH

  UpdateText("Ctrl_Pos", wText)
  sbTxt := ""

  Loop {
    ovi := ""
    Try ovi := StatusBarGetText(A_Index)
    if (ovi = "")
      break
    sbTxt .= "(" A_Index "):`t" textMangle(ovi) "`n"
  }

  sbTxt := SubStr(sbTxt,1,-1) ; StringTrimRight, sbTxt, sbTxt, 1
  ; UpdateText("Ctrl_SBText", sbTxt)
  bSlow := oGui["Ctrl_IsSlow"].Value ; GuiControlGet, bSlow,, Ctrl_IsSlow

  if (bSlow) {
    DetectHiddenText False
    ovVisText := WinGetText() ; WinGetText, ovVisText
    DetectHiddenText True
    ovAllText := WinGetText() ; WinGetText, ovAllText
  } else {
    ovVisText := WinGetTextFast(false)
    ovAllText := WinGetTextFast(true)
  }

  ; UpdateText("Ctrl_VisText", ovVisText)
  ; UpdateText("Ctrl_AllText", ovAllText)

}

; ===========================================================================================
; WinGetText ALWAYS uses the "slow" mode - TitleMatchMode only affects
; WinText/ExcludeText parameters. In "fast" mode, GetWindowText() is used
; to retrieve the text of each control.
; ===========================================================================================
WinGetTextFast(detect_hidden) { 
  controls := WinGetControlsHwnd()

  static WINDOW_TEXT_SIZE := 32767 ; Defined in AutoHotkey source.

  buf := Buffer(WINDOW_TEXT_SIZE * 2,0)

  text := ""

  Loop controls.Length {
    hCtl := controls[A_Index]
    if !detect_hidden && !DllCall("IsWindowVisible", "ptr", hCtl)
      continue
    if !DllCall("GetWindowText", "ptr", hCtl, "Ptr", buf.ptr, "int", WINDOW_TEXT_SIZE)
      continue

    text .= StrGet(buf) "`r`n" ; text .= buf "`r`n"
  }
  return text
}

; ===========================================================================================
; 与使用纯GuiControl不同，此函数会令控件仅在文本发生更改时更新，防止定期更新导致闪烁（尤其是在旧系统上）
; ===========================================================================================
UpdateText(vCtl, NewText) {
  Global oGui
  static OldText := {}
  ctl := oGui[vCtl], hCtl := Integer(ctl.hwnd)

  if (!oldText.HasProp(hCtl) Or OldText.%hCtl% != NewText) {
    ctl.Value := NewText
    OldText.%hCtl% := NewText
  }
}

; 这段代码的作用是对输入的文本进行处理，如果文本中包含换行符或长度超过40个字符，就进行截取，并在末尾添加省略号
textMangle(x) {
  elli := false
  if (pos := InStr(x, "`n"))
    x := SubStr(x, 1, pos-1), elli := true
  else if (StrLen(x) > 40)
    x := SubStr(x,1,40), elli := true
  if elli
    x .= " (...)"
  return x
}

suspend_timer() {
  Global oGui
  SetTimer Update, 0
  UpdateText("Ctrl_Freeze", oGui.txtFrozen)
}

~*Shift::
  ~*Ctrl::suspend_timer()

~*Ctrl up::
  ~*Shift up::SetTimer Update, 250
