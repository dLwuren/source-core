from flask import Flask, request
from flask_cors import CORS  # 跨域问题
from flask_socketio import SocketIO
import threading
from engineio.async_drivers import eventlet

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
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")


@socketio.on("message")
def handle_message(msg):
    print(f"连接socket: {msg}")

    # 检测服务器是否正常工作


@app.route("/api/test", methods=("GET", "POST"))
def test():
    return "连接正常"

if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1", port=5000)
    # eventlet.monkey_patch()
    # socketio.run(app, host='127.0.0.1', port=5000)