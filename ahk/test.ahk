; 该文件用于测试一些功能
#Requires AutoHotkey v2.0

test(){
  ; FileCreateShortcut("D:\Typora\Typora.exe", "C:\Users\dL\Desktop\12322.lnk")

  ; str := "D:\Typora\Typora.exe"
  ; regex := ".*\\(.*)$"
  ; if (RegExMatch(str, regex, &OutputVar)) {
  ;   lastPath := OutputVar[1]
  ;   MsgBox(lastPath) 
  ; }

  ; MsgBox(A_Desktop '\12.lnk')

  ; winList := WinGetList()
  ; MsgBox(winList[2])

  ; ids := WinGetList(,, "Program Manager")
  ; for this_id in ids
  ; {
  ;   WinActivate this_id
  ;   this_class := WinGetClass(this_id)
  ;   this_title := WinGetTitle(this_id)
  ;   this_pid := WinGetPID(this_id)

  ;   Result := MsgBox(
  ;   (
  ;   "Visiting All Windows
  ;   " A_Index " of " ids.Length "
  ;   ahk_id " this_id "
  ;   ahk_class " this_class "
  ;   " this_title "

  ;   Continue?"
  ;   this_pid

  ;   ),, 4)
  ;   if (Result = "No")
  ;     break
  ; }

  ; test:=''
  ; for this_id in ids
  ; {
  ;   test:= this_id ',' test
  ; }
  ; arr := '[' RegExReplace(test, "(,)$", "]")
  ; MsgBox(arr)

  ; MsgBox(FormatTime(A_Now, "yyyy年"))
  ; MsgBox(FormatTime(A_Now, "yyyy年"))

  ; Run "WindowSpy.ahk"

}
test()

; :*?:123::
;   {
;     A_Clipboard := ""
;     ; Send("{Raw}" A_Clipboard)
;   }

; 指定应用里才激活 热键、热字符串
; HotIfWinActive "ahk_class Notepad"
; Hotkey "a", ShowMsgBox
; Hotstring "::btw", "This replacement text will occur only in Notepad."
; HotIfWinActive

; Hotkey "#c", (*) => MsgBox("You pressed Win-C in a window other than Notepad.")

; ShowMsgBox(HotkeyName)
; {
;   MsgBox "You pressed " HotkeyName " while Notepad is active."
; }

; post(){
;   API_URL := "http://127.0.0.1:5030/api/socket"
;   HTTP_Request := ComObject("WinHttp.WinHttpRequest.5.1")
;   HTTP_Request.Open("POST", API_URL, true)
;   HTTP_Request.SetRequestHeader("Content-Type", "application/json")
;   HTTP_Request.SetTimeouts(60000, 60000, 60000, 60000)

;   Messages := "runTask"
;   Messages1 := "C:\\Users\\dL\\Desktop\\测试test\\test.js"
;   Messages2 := "321"
;   ; JSON_Request := '{ "model": "' API_Model '", "messages": [' Messages '] }'

;   res := "`{`n" 
;   . "`"type`":`"" Messages "`",`n"
;   . "`"path`":`"" Messages1 "`"`n"
;   . "`}"

;   ; 会以字节字符串发送，记得在服务器端先将之转为普通字符串再转为json
;   HTTP_Request.Send(res)
;   HTTP_Request.WaitforResponse()
; }

; ^j::
;   {
;     post()
;   }

; SetTimer Alert1, 500
; WindowList := [""]
; Value := ""
; Alert1(){
;   ; if(WindowList.Length != 0){
;     Value := WindowList.Pop()

;     if (Value=WinExist("A"))
;     {
;       WindowList.push(WinExist("A"))
;     }
;     else
;     {
;       if (value!="")
;         WindowList.push(Value)
;       WindowList.push(WinExist("A"))
;     }
;   ; }

;   return
; }
; Alert1()

; ;最近两个窗口切换！！好用
; #z::{
;   Value := WindowList[WindowList.Length - 1]

;   if(!WinExist(Value))
;   {
;     WindowList.RemoveAt(WindowList.Length-1)
;   }

;   WinActivate(Value)

; }
; return

