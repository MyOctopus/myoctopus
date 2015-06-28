import myoctopus.restapi.host_flask as host
import myoctopus.evaluator.python_evaluator as evaluator
import myoctopus.datastore.store_sqlite as store
import myoctopus.sensors
import time
import threading
import inspect
import pkgutil
import sys
import os
#src = inspect.getsource(module)

#TODO: To be extracted to separate process

evalThread = threading.Thread(target=lambda: evaluator.run())
evalThread.daemon = True
evalThread.start()


sensors_path = os.path.dirname(sys.modules['myoctopus.sensors'].__file__)

for file in [f for f in os.listdir(sensors_path) if f.endswith('.py') and f != '__init__.py']:
    data = open(os.path.join(sensors_path, file), 'rb').read()
    print 'Executed: %s, %s' % (file, len(data))
    store.evaluate(file, data);

print 'Now will run the host'
time.sleep(3)
host.run()
