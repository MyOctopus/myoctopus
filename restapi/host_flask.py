from flask import Flask, request
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/data/<key>", methods=['GET','PUT'])
def get_data(key):
    if request.method == "GET":
        remove = 'remove' in request.args
        return "About to return %s %sdestructive" % (key, not remove and "non-" or "")
    evl = 'eval' in request.args
    if evl:
        lang = request.args.get('lang', "python")
        return "About to evaluate\nlang: %s\n%s" % (lang, request.data)
    return "Would upload the body\n%s" % \
           (request.data, )

if __name__ == "__main__":
    app.run()