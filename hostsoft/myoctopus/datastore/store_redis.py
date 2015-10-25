import redis
import hashlib
from flask.ext.socketio import SocketIO, emit
import json

db = redis.Redis()
socketio = None


def put(key, value, hashed=False):
    db.set(key,value)
    # print key,value
    if socketio:
        # print key, value
        socketio.emit(key, {'data': value}, namespace='/test')

def read(key, remove=False):
    return db.get(key)


def evaluate(key, code):
    db.rpush('eval', (key, code))


def get_evals():
    r = db.lpop('eval')
    if not r: return None
    return eval(r)


def main():
    put("test", "test")
    print read("test")
    #print out("test")
    print read("test")
    evaluate('test', 'def main(): return "test"')
    evaluate('test1', 'def main(): return "test"')
    print get_evals()
    print get_evals()
    print get_evals()

if __name__ == '__main__': main()
