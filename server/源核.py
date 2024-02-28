import os, time, subprocess, psutil, signal, json, re
import glob
import atexit
from flask import Flask, request
from flask_cors import CORS  # 跨域问题
from flask_socketio import SocketIO

# 显式导入 engineio ，避免打包时漏掉该包
import threading
from engineio.async_drivers import threading

import functions

# 令 flask 指向 dist 文件夹，而不是 templates
app = Flask(
    __name__,
    # 用template_folder来指定html文件的路径
    template_folder="../dist",
    # 用static_folder+static_url_path来指定静态文件(js、css)的目录
    static_folder="../dist",
    static_url_path="",
)
app.config["SECRET_KEY"] = "secret_key"
app.config["JSON_AS_ASCII"] = False


# 使服务器能够跨域
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*")
# 打包时要使用该函数修改程序中的路径
resource_path = functions.resource_path

# 在应用同级文件创建一个 store.json 以实现数据持久化
functions.create_store_json(functions.configFile_path)
functions.update_starter()

# 启动启动器进程
exe_path = "ahk/AutoHotkey64.exe"
ahk_script = "ahk/启动器.ahk"
exe_path = resource_path(exe_path)
ahk_script = resource_path(ahk_script)
command = [exe_path, ahk_script]
starter_process = subprocess.Popen(command, stdout=subprocess.PIPE)

# 启动子进程
# child_process = subprocess.Popen(["server/yh.exe"])
child_process = subprocess.Popen([resource_path("yh.exe")])


# 客户端使用 socket.emit("信号名", "信号内容") 发送消息，用下面代码接收
# @socketio.on("信号名")
# def handle_message(msg):
#     print(f"{msg}")


@socketio.on("message")
def handle_message(msg):
    print(f"连接socket: {msg}")


# 开发时保留该路由，打包时可去除
# @app.route("/")
# def index():
#     return render_template("index.html")


# 检测服务器是否正常工作
@app.route("/api/test", methods=("GET", "POST"))
def test():
    return "连接正常"


# 命令行传参执行 index.ahk
@app.route("/api/ahk", methods=("GET", "POST"))
def ahk():
    if request.method == "POST":
        # data 是 json 对应的对象
        data = request.get_json()
        # 将对象的值取出并转为 list
        paraList = list(data.values())

        exe_path = "ahk/AutoHotkey64.exe"
        ahk_script = "ahk/index.ahk"

        exe_path = resource_path(exe_path)
        ahk_script = resource_path(ahk_script)

        arguments = paraList
        command = [exe_path, ahk_script] + arguments
        print("命令行", command, paraList)

        timeout = 1  # 超时
        # returncode = subprocess.run(command, capture_output=True, timeout=timeout)
        returncode = subprocess.Popen(command, stdout=subprocess.PIPE)
        stdout, stderr = returncode.communicate(timeout=timeout)
        print("返回了", stdout.decode("utf-8"), stderr)
    return stdout.decode("utf-8")


@app.route("/api/py", methods=("GET", "POST"))
def py():
    if request.method == "POST":
        # data 是 json 对应的对象
        data = request.get_json()

        # print("参数", data)
        match data["type"]:
            case "click":
                print("点击", data["xy"])

                if data["xy"] == None:
                    functions.click()
                else:
                    # 格式(num,num)，取出里面的数字作为 x、y
                    regex = r"\((\d+),\s*(\d+)\)"
                    match = re.search(regex, data["xy"])
                    if match:
                        x = int(match.group(1))
                        y = int(match.group(2))
                        functions.click(x, y)
            case "getControlId":
                functions.getControlId()
            case "moveMouse":
                regex = r"\((\d+),\s*(\d+)\)"
                match = re.search(regex, data["xy"])

                if match:
                    x = int(match.group(1))
                    y = int(match.group(2))
                    functions.moveMouse(x, y)
            case "pictureCenter":
                return functions.pictureCenter(data["path"])
    return '{"msg":"完成"}'


# 内置工具
@app.route("/api/tool", methods=("GET", "POST"))
def tool():
    if request.method == "POST":
        data = request.get_json()
        # 将对象的值取出并转为 list
        paraList = list(data.values())

        if data["type"] == "winInfoTool":
            exe_path = "ahk/AutoHotkey64.exe"
            ahk_script = "ahk/WindowSpy.ahk"

            exe_path = resource_path(exe_path)
            ahk_script = resource_path(ahk_script)
            arguments = paraList
            command = [exe_path, ahk_script] + arguments

            returncode = subprocess.run(command)
            if returncode.returncode != 0:
                return '{"msg":"请求失败"}'
    return ""


# 文件操作
@app.route("/api/file", methods=("GET", "POST"))
def file():
    if request.method == "POST":
        data = request.get_json()
        match data["type"]:
            case "readFile":
                return functions.read_file(data["path"])
            case "renameFile":
                return functions.rename_file(data["path"], data["newPath"])
            case "moveFile":
                return functions.move_file(data["path"], data["newPath"])
            case "newFile":
                print(
                    "路径", data["path"], data["name"], data["isDir"], data["content"]
                )
                functions.new_file(
                    data["name"], data["path"], data["isDir"], data["content"]
                )
            case "writeFile":
                functions.write_file(data["path"], data["content"])
            case "saveJs":
                functions.save_js(data["file"])
            case "saveTask":
                functions.save_task(data["fileContent"])
            case "getJs":
                if data["path"] is not None:
                    with open(data["path"], "r", encoding="utf-8") as file:
                        content = file.read()
                    return content
            case "fileList":
                list = {}
                config = functions.get_config()
                for f in functions.get_folders_with_direct_js_files(
                    config["file_path"]
                ):
                    list[f] = glob.glob(os.path.join(f, "*.js"))
                return json.dumps(list)
            case "saveConfig":
                config = {}
                if "path" in data:
                    config["file_path"] = data["path"]
                if "code" in data:
                    config["hotkey_code"] = data["code"]
                functions.save_config(config)
            case "getConfig":
                return json.dumps(functions.get_config())
            case "deleteFile":
                functions.delete_file(data["path"])
    return '{"msg":"完成"}'


# 任务启动器
@app.route("/api/starter", methods=("GET", "POST"))
def starter():
    if request.method == "POST":
        data = request.get_json()
        global starter_process
        match data["type"]:
            case "updataStarter":
                functions.update_starter()
            case "runStarter":
                # 开启进程运行 启动器.ahk 。
                exe_path = "ahk/AutoHotkey64.exe"
                ahk_script = "ahk/启动器.ahk"
                exe_path = resource_path(exe_path)
                ahk_script = resource_path(ahk_script)

                command = [exe_path, ahk_script]
                starter_process = subprocess.Popen(command, stdout=subprocess.PIPE)
    return ""


# 服务器向客户端推送信息
@app.route("/api/socket", methods=("GET", "POST"))
def socket():
    if request.method == "POST":
        # string 是一个字典字符串，注意，最后一项不能有逗号
        string = request.data.decode("utf-8")
        data = json.loads(string)
        match data["type"]:
            case "runTask":
                if data["path"] is not None:
                    with open(data["path"], "r", encoding="utf-8") as file:
                        code = file.read()
                    socketio.emit("runTask", {"code": code})
            case "sendSignal":
                if data["signal"]:
                    socketio.emit(data["signal"])
            case "sendData":
                # time.sleep(100/1000) # 少量延迟，避免前端未及时注册 socketio.once
                socketio.emit(data["uuid"], data["data"])
                print(data["uuid"], data["data"])
    return ""


@app.route("/api/init", methods=("GET", "POST"))
def init():
    if request.method == "POST":
        data = request.get_json()
        while True:
            # 检查子进程是否在运行
            if psutil.pid_exists(data["pid"]):
                # 如果程序在运行，5s 后再检查
                time.sleep(5)
            else:
                # 如果子进程已经退出，关闭主进程
                global starter_process
                starter_process.kill()
                os.kill(os.getpid(), signal.SIGINT)


# 注册清理函数。当主进程退出时会执行，程序崩溃时不会执行
@atexit.register
def cleanup():
    # 清理掉工作路径里面的空文件夹
    config = functions.get_config()
    functions.clear_trash_folder(config["file_path"])

    # 关闭子进程、启动器进程
    child_process.terminate()
    global starter_process
    starter_process.kill()
    print("子进程已关闭")


# 判断当前模块是否作为主程序，是则直接运行。
# 如果模块被导入为其他模块的子模块，那么这部分特定的代码逻辑就不会被执行。
# 打包时关闭 debug 模式，否则代码会运行 2 次
if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1", port=5030)
