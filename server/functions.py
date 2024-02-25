import json, os, sys, shutil
import pyautogui
import subprocess
from tkinter import filedialog
import asyncio

# 执行 ahk
# def run_subprocess():
#     exe_path = "ahk/AutoHotkey64.exe"
#     ahk_script = "ahk/starter.ahk"

#     command = [exe_path, ahk_script]
#     print("命令行", command)

#     subprocess.run(command, capture_output=True)


# 文件路径替换 打包成 exe 时使用
def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


# -------------- 应用默认配置 --------------
desk = os.path.join(os.path.expanduser("~"), "Desktop") + "\\"
default_config = dict(file_path=desk, hotkey_code="")

# -------------- 键鼠操作 --------------


def click(x=None, y=None, clicks=1, interval=0.0, button="left", duration=0.0):
    # interval：int 或浮点数，表示每次单击之间需要等待多少秒，默认值为0.0，表示单击之间没有暂停
    if x is None and y is None:
        x = pyautogui.position()[0]
        y = pyautogui.position()[1]
    pyautogui.click(x, y, clicks, interval, button, duration)


# 按住鼠标的某个键拖动到指定位置
def drag(x, y, interval, button, duration):
    pyautogui.dragTo(x=None, y=None, button="left", duration=0.0)


# 鼠标滚动
def scroll(direction: str = "", distance=0):
    if direction == "vertical":
        pyautogui.scroll(distance)
    else:
        # 水平滚动
        pyautogui.hscroll(distance)


# 移动鼠标
def moveMouse(x=None, y=None, duration=0.0):
    pyautogui.moveTo(x, y)


# 获取图片中心坐标
def pictureCenter(path):
    # btm = pyautogui.locateOnScreen(path) # 匹配 1 个最近的图片
    btm = pyautogui.locateAllOnScreen(path)  # 匹配多个图片
    new_btm = []
    for p in btm:
        x = pyautogui.center(p).x
        y = pyautogui.center(p).y
        new_btm.append(f"({x},{y})")

    return new_btm


# -------------- 应用配置 --------------


configFile_path = "store/store.json"
# configFile_path = resource_path(configFile_path)


# 存储配置
def save_config(data):
    config = get_config()
    new_config = {**config, **data}  # 合并配置

    # ensure_ascii=False 解决中文字符串问题
    data_json = json.dumps(new_config, ensure_ascii=False)
    with open(configFile_path, "w", encoding="utf-8") as file:
        file.write(data_json)


# 获取配置
def get_config():
    with open(configFile_path, "r", encoding="utf-8") as file:
        data_json = file.read()
    if data_json != "":
        data = json.loads(data_json)
        config = {
            "file_path": (
                data["file_path"]
                if data.get("file_path") != "" and "file_path" in data
                else default_config["file_path"]
            ),
            "hotkey_code": (
                data["hotkey_code"]
                if data.get("hotkey_code") != "" and "hotkey_code" in data
                else default_config["hotkey_code"]
            ),
        }
        return config
    else:
        return default_config


# 获取所有直接含有.js文件的文件夹。如果是子文件夹含有.js则忽略
def get_folders_with_direct_js_files(path):
    folders_with_direct_js_files = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            if any(file.endswith(".js") for file in os.listdir(item_path)):
                folders_with_direct_js_files.append(item_path)
    return folders_with_direct_js_files


# 更新启动器
def update_starter():
    # 获取“启动器.txt”里面的内容，并写入到 启动器.ahk 里面
    # path = get_config()["file_path"] + "\启动器.txt"
    # with open(path, "r", encoding="utf-8") as file:
    #     content = file.read()

    content = get_config()["hotkey_code"]

    # 开发时使用路径 ahk_path = "ahk/启动器.ahk"
    # 打包时使用路径  resource_path("ahk/启动器.ahk")
    ahk_path = "ahk/启动器.ahk"
    # ahk_path = resource_path(ahk_path)

    with open(ahk_path, "w", encoding="utf-8") as file:
        content = (
            """#Requires AutoHotkey v2.0
                  #NoTrayIcon
                  #SingleInstance Force
                  #Warn All, Off
                  SetWorkingDir A_ScriptDir
                  #Include ./functions.ahk"""
            + "\n"
            + content
        )
        file.write(content)


# -------------- 文件操作 --------------


def read_file(path):
    if os.path.isfile(path):
        with open(path, "r", encoding="utf-8") as file:
            data = file.read()
            return data


def save_js(data):
    file_path = filedialog.asksaveasfilename(
        defaultextension=".js",
        filetypes=[("Js", "*.js")],
    )
    if file_path is not None:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(data)


def save_task(data):
    path = get_config()["file_path"]
    if path is not None:
        print(path)


# 追加文件
def add_file(data):
    file_path = filedialog.asksaveasfilename(
        defaultextension=".json",
        filetypes=[("Json", "*.json")],
    )
    if file_path is not None:
        with open(file_path, "a", encoding="utf-8") as file:
            file.write(data)


# 保存文件 / 改写文件
def write_file(path, content):
    if os.path.isfile(path):
        with open(path, "w", encoding="utf-8") as file:
            file.write(content)


# 删除文件 or 文件夹
def delete_file(path):
    # 确保文件存在才删除
    if os.path.isfile(path):
        os.remove(path)
    if os.path.isdir(path):
        shutil.rmtree(path)  # 删除此路径的文件夹


# 重命名文件 or 文件夹
def rename_file(path, new_name):
    if os.path.exists(path):
        os.rename(path, new_name)


# 移动文件
def move_file(path, new_name):
    if os.path.exists(path):
        shutil.move(path, new_name)


# 新建文件 or 文件夹
# content 文件内容
def new_file(name, path, isDir=False, content=""):
    print("是否为文件夹", os.path.isdir(path), path)
    if os.path.isdir(path):
        if isDir:
            os.makedirs(path + "\\" + name)
        else:
            print("新建文件夹", path + "\\" + name)
            with open(path + "\\" + name, "w", encoding="utf-8") as file:
                file.write(content)


# 清理垃圾文件夹
# 程序运行时会产生大量空文件夹，这些属于垃圾文件夹
def clear_trash_folder(path):
    trash_files = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            # 获取空文件夹
            if len(os.listdir(item_path)) == 0:
                trash_files.append(item_path)
    for trash_file in trash_files:
        shutil.rmtree(trash_file)  # 删除此路径的文件夹
