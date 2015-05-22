import psycopg2
import hashlib

def get_connection():
    conn = psycopg2.connect("dbname='postgres' user='postgres' host='127.0.0.1' password='postgres'")
    return conn

def get_cursor():
    return get_connection().cursor()

def execute(query):
    conn = get_connection()
    cur = conn.cursor()
    result = cur.fetchall()
    cur.executemany(query)
    conn.commit()
    return result

def init_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("create table datastore (id VARCHAR(256), data text)")
    conn.commit()

def hash(key):
    return hashlib.sha256(key).hexdigest()

def put(key, value):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("insert into datastore (id, data) values ('%s', '%s')" %(hash(key), value))
    conn.commit()

def read(key):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select data from datastore where key = ?", (hash(key),))
    result = cur.fetchall()
    conn.commit()

def out(key):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select data from datastore where key = ?", (hash(key),))
    result = cur.fetchall()
    cur.execute("delete from datastore where key = ?", (hash(key),))
    conn.commit()


def main():
    #init_table()
    put("test", "test")
    print read("test")
    print out("test")

if __name__ == '__main__': main()

