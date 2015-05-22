import hostsoft.datastore.store_sqlite as store
from threading import Thread
from time import sleep
import imp


def pooler():
    while True:
        es = store.get_evals()
        if es:
            module = imp.new_module("eval_module")
            key, code = es
            print code
            exec code in module.__dict__
            result = module.main()
            store.put(key, result, hashed=True)
        else:
            print "No Jobs for evaluation"
        sleep(1)

def run():
    t = Thread(target=pooler)
    t.start()
