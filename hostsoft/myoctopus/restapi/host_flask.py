
from gevent import monkey
monkey.patch_all()

import myoctopus.datastore.store_redis as store
from flask import Flask, request, stream_with_context, Response
from flask.ext.cors import CORS, cross_origin
from flask.ext.socketio import SocketIO
import json

import time
from threading import Thread
from flask import Flask, render_template, session, request, send_from_directory
from flask.ext.socketio import SocketIO, emit, join_room, leave_room, \
    close_room, disconnect
from Queue import Queue
q = Queue()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretoctopus'
CORS(app)
socketio = SocketIO(app)
# store.socketio = socketio

store.socketio = socketio
# store.q = q

@app.route("/")
def index():
    return "Will add short instruction here"

@app.route('/dashboard/<path:path>')
def send_dash(path):
    return send_from_directory('../dashboard-21', path)

thread = None

# def background_thread():
#     """Example of how to send server generated events to clients."""
#     count = 0
#     while True:
#         time.sleep(0.2)
#         count += 1
#         value = store.read("aggregated")
#         socketio.emit('data',
#                       {'data': value, 'count': count},
#                       namespace='/test')

# def background_thread():
#     count = 0
#     while True:
#         item = q.get()
#         print 'got item', item
#         socketio.emit('data',
#                       item,
#                       namespace='/test')
#         q.task_done()

# @app.route("/stream")
# def streamer():
#     def generate():
#         while True:
#             time.sleep(0.01)
#             value = store.read("aggregated")
#             yield value
#     return Response(stream_with_context(generate()))


@app.route("/data/<key>", methods=['GET', 'PUT'])
@cross_origin()
def get_data(key):
    if request.method == "GET":
        remove = 'remove' in request.args
        if remove:
            value = store.read(key, remove=True)
        else:
            value = store.read(key)
        if not value:
            return "Key not found", 404
        return value
    evl = 'eval' in request.args
    if evl:
        lang = request.args.get('lang', "python")
        store.evaluate(key, request.data)
        return "About to evaluate\nlang: %s\n%s" % (lang, request.data)
    store.put(key, request.data)
    return "Uploading the body\n%s" % \
           (request.data, )

@socketio.on('my event', namespace='/test')
def handle_my_custom_namespace_event(json):
    print('received json: ' + str(json))
    emit('my_response', {'data': 'got it!'})

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected', 'count': 0})
    # global thread
    # if thread is None:
    #     thread = Thread(target=background_thread)
    #     thread.start()


def run():
    # app.debug = True
    #app.run(host="0.0.0.0", port=8880)
    socketio.run(app, host="0.0.0.0", port=8880)
