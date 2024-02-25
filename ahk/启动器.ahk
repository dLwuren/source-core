#Requires AutoHotkey v2.0
                  #NoTrayIcon
                  #SingleInstance Force
                  #Warn All, Off
                  SetWorkingDir A_ScriptDir
                  #Include ./functions.ahk
MButton::
{
send("^+!{up}")
}

XButton1::
{
 runTask("C:\Users\dL\Desktop\测试test\输入回车.js")
}

XButton2::
{
 runTask("C:\Users\dL\Desktop\测试test\输入bs.js")
}

^!Down::
{
 runTask("C:\Users\dL\Desktop\测试test\窗口最小化.js")
}

; 快捷键: "ctrl+q"
^q::{
        runTask('C:\Users\dL\Desktop\1\测试test\test ahk.js')
        
      }