#TODO: This module should run in isolation, some sort of sandbox and should be separate from the main process
#TODO: potentially it could use "chrooted" filesystem or something like it to convert code objects into values.
#TODO: also it can run though user account with a very limited permissions close to none as all comms/data access
#TODO: would be happening though api anyway - this should not be a problem.


import myoctopus.datastore.store_redis as store
from time import sleep
import imp
import threading

threads = []

def runner(key, code):
    module = imp.new_module("eval_module")
    exec code in module.__dict__
    result = module.main()
    store.put(key, result)


def run():
    while True:
        es = store.get_evals()
        if es:
            print 'got thread', len(es)
            key, code = es
            evalThread = threading.Thread(target=runner, args=(key, code,))
            evalThread.daemon = True
            evalThread.start()
            threads.append(evalThread)
        else:
            pass
            #print "No Jobs for evaluation"
        sleep(1)
