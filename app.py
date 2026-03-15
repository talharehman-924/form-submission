from flask import Flask, render_template, request, redirect, url_for
import os
import sqlite3
import time
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join('static', 'uploads')
DB_PATH = 'data.db'
ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


def init_db():
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        '''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mobile TEXT,
            address TEXT,
            photo TEXT
        )
        '''
    )
    conn.commit()
    conn.close()


@app.route('/', methods=['GET', 'POST'])
def index():
    init_db()
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        mobile = request.form.get('mobile', '').strip()
        address = request.form.get('address', '').strip()

        photo_filename = None
        photo = request.files.get('photo')
        if photo and photo.filename and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            # add timestamp to avoid collisions
            timestamp = str(int(time.time() * 1000))
            filename = f"{timestamp}_{filename}"
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            photo.save(save_path)
            photo_filename = filename

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO users (name, mobile, address, photo) VALUES (?, ?, ?, ?)',
            (name, mobile, address, photo_filename),
        )
        conn.commit()
        conn.close()
        return redirect(url_for('index'))

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT * FROM users ORDER BY id DESC')
    rows = cur.fetchall()
    users = [dict(r) for r in rows]
    conn.close()
    return render_template('index.html', users=users)


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
