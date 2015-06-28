import threading
import myoctopus.network.routing as routing
import datetime
import time

SLEEP_TIME=0.5

def put(key, value):
    node = routing.get_node_for_key(key)
    node.put(key, value)

def read(key, target=None, remove=False, timeout=None):
    start = datetime.datetime.now()

    def get():
        while(True):
            node = routing.get_node_for_key(key)
            value = node.read(key, remove)
            if value:
                if not target: return value
                target(key, value)
                return None
            if timeout == 0 or start + datetime.timedelta(seconds=timeout) < datetime.datetime.now():
                if target: target(key, None)
                return None
            time.sleep(SLEEP_TIME)
    if target:
        runner = threading.Thread(target=get)
        runner.daemon = True
        runner.start()
        return None
    return get()
