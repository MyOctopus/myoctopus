import hostsoft.restapi.host_flask as host
import hostsoft.evaluator.python_evaluator as evaluator
import time
import threading

#TODO: To be extracted to separate process
evalThread = threading.Thread(target=lambda: evaluator.run())

evalThread.daemon = True
evalThread.start()

host.run()
