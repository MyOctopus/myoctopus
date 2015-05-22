import hostsoft.datastore.store_sqlite as store
from flask import Flask, request
# import logging

app = Flask(__name__)

@app.route("/")
def index():
    return "Will add short instruction here"

@app.route("/data/<key>", methods=['GET', 'PUT'])
def get_data(key):
    if request.method == "GET":
        remove = 'remove' in request.args
        if remove:
            value = store.out(key)
        else:
            value = store.read(key)
        if not value:
            return "Key not found", 404
        return value
    evl = 'eval' in request.args
    if evl:
        lang = request.args.get('lang', "python")
        #TODO: Implement this
        return "About to evaluate\nlang: %s\n%s" % (lang, request.data)
    store.put(key, request.data)
    return "Uploading the body\n%s" % \
           (request.data, )

if __name__ == "__main__":
    # app.logger.setLevel(logging.INFO)
    app.debug = True
    app.run()
