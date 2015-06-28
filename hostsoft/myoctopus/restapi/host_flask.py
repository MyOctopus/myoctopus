import myoctopus.datastore.store_sqlite as store
from flask import Flask, request


app = Flask(__name__)


@app.route("/")
def index():
    return "Will add short instruction here"


@app.route("/data/<key>", methods=['GET', 'PUT'])
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

def run():
    app.debug = True
    app.run(host="0.0.0.0", port=6666)
