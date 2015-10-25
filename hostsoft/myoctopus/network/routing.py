import myoctopus.datastore.store_redis as store

class LocalNode(object):

    def read(self, key, remove):
        return store.read(key, remove)

    def put(self, key, value):
        store.put(key, value)

def get_node_for_key(key):
    return LocalNode()
