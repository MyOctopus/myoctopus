import sqlite3 as lite
import hashlib

def get_connection():
    conn = lite.connect("test1.db")
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
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='datastore'")
    if not cur.fetchall():
        cur.execute("create table datastore (key VARCHAR(256), data text)")
    conn.commit()

def hash(key):
    return hashlib.sha256(key).hexdigest()

def put(key, value):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("insert into datastore (key, data) values ('%s', '%s')" %(hash(key), value))
    conn.commit()

def read(key):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select data from datastore where key = ?", (hash(key),))
    result = cur.fetchall()
    conn.commit()
    return result

def out(key):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select data from datastore where key = ?", (hash(key),))
    result = cur.fetchall()
    cur.execute("delete from datastore where key = ?", (hash(key),))
    conn.commit()
    return result


def main():
    init_table()
    put("test", "test")
    print read("test")
    print out("test")
    print read("test")

if __name__ == '__main__': main()

