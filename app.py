#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO, Namespace, emit, join_room, leave_room, rooms
import oprdb
import random
import os

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()
'''
def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')
'''
@app.route('/')
def index():
    return render_template('index2.html', async_mode=socketio.async_mode)


class MyNamespace(Namespace):
    '''
    def on_my_event(self, message):
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response',
             {'data': message['data'], 'count': session['receive_count']})

    def on_my_broadcast_event(self, message):
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response',
             {'data': message['data'], 'count': session['receive_count']},
             broadcast=True)

    def on_my_room_event(self, message):
        session['receive_count'] = session.get('receive_count', 0) + 1
        print(rooms())
        emit('my_response',
             {'data': message['data'], 'count': session['receive_count']},
             room=message['room'])

    def on_disconnect_request(self):
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response',
             {'data': 'Disconnected!', 'count': session['receive_count']})
        disconnect()

    def on_leave(self, message):
        leave_room(message['room'])
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response',
             {'data': 'In rooms: ' + ', '.join(rooms()),
              'count': session['receive_count']})

    def on_join(self, message):
        join_room(message['room'])
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response',
             {'data': 'In rooms: ' + ', '.join(rooms()),
              'count': session['receive_count']})

    def on_connect(self):
        global thread
        with thread_lock:
            if thread is None:
                thread = socketio.start_background_task(background_thread)
        emit('my_response', {'data': 'Connected', 'count': 0})

    def on_close_room(self, message):
        session['receive_count'] = session.get('receive_count', 0) + 1
        emit('my_response', {'data': 'Room ' + message['room'] + ' is closing.',
                             'count': session['receive_count']},
             room=message['room'])
        close_room(message['room'])

    def on_my_ping(self):
        emit('my_pong')

    def on_disconnect(self):
        emit('my_response',{'data': rooms(), 'count': session['receive_count']},
             broadcast=True)
        print('Client disconnected', request.sid)

    '''
    def on_hostjoin(self):
        rooms=oprdb.sendrooms()
        remrooms=list(set([i for i in range(10000)])-set(rooms))
        room=random.choice(remrooms)
        #部屋番号を返す
        join_room(room)
        oprdb.addroom(room)
        emit('hostroom',{'room':room})

    def on_memjoin(self, message):
        room=oprdb.sendrooms()
        if message['room'] in room:
            join_room(message['room'])
            emit('memroom',{'room':True})
            oprdb.addmember(message['room'])
        else:
            emit('memroom',{'room':False})

    #def on_hostquit(self, message):
    #    oprdb.deleteroom(message['room'])

    def on_quit(self, message):
        leave_room(message['room'])
        oprdb.redmember(message['room'])

    def on_disconnect(self):
        room=rooms()
        for v in room:
            if(isinstance(v,int)):
                leave_room(v)
                oprdb.redmember(v)

    def on_answermyid(self):
        emit('myId',{'myId':rooms()})

    def on_card(self, message):
        emit('my_card',
             message,
             room=message['room'],
             broadcast=True)

    def on_reqcard(self,message):
        emit('reqcard',room=message['room'],
             broadcast=True)

    def on_initcard(self,message):
        emit('initcard',
             {'cards':message['cards']},
             room=message['room'])

socketio.on_namespace(MyNamespace('/test'))


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app,port=port)
