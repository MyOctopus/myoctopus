import sqlite3 as lite
import hashlib


def get_connection():
    conn = lite.connect("datastore.db")
    return conn


def init_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='datastore'")
    if not cur.fetchall():
        cur.execute("create table datastore (key VARCHAR(256), data text)")
    conn.commit()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='evalstore'")
    if not cur.fetchall():
        cur.execute("create table evalstore (key VARCHAR(256), code text)")
    conn.commit()


def hash(key):
    return hashlib.sha256(key).hexdigest()


def put(key, value, hashed=False):
    conn = get_connection()
    cur = conn.cursor()
    hashed_key = hashed and key or hash(key)
    cur.execute("insert into datastore (key, data) values (?, ?)", (hashed_key, value))
    conn.commit()


def read(key, remove=False):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select data from datastore where key = ?", (hash(key),))
    result = cur.fetchall()
    if remove: cur.execute("delete from datastore where key = ?", (hash(key),))
    conn.commit()
    return result and result[0][0] or None


def evaluate(key, code):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("insert into evalstore (key, code) values (?, ?)" , (hash(key), code))
    conn.commit()


def get_evals():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("select key, code from evalstore LIMIT 1")
    result = cur.fetchall()
    if not result:
        return None
    cur.execute("delete from evalstore where key = ?", (result[0][0],))
    conn.commit()
    return result[0]


def main():
    init_table()
    put("test", "test")
    print read("test")
    print out("test")
    print read("test")
    evaluate('test', 'def main(): return "test"')
    evaluate('test1', 'def main(): return "test"')
    print get_evals()
    print get_evals()
    print get_evals()

if __name__ == '__main__': main()
else:
    init_table()
