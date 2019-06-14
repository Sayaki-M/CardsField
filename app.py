#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, Namespace, emit, join_room, leave_room, \
    close_room, rooms, disconnect

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()


@app.route('/')
def index():
    return render_template('index2.html', async_mode=socketio.async_mode)


class MyNamespace(Namespace):
    def on_join(self, message):
        join_room(message['room'])      

    def on_my_ping(self):
        emit('my_pong')
        
    def on_disconnect(self):
        print('Client disconnected', request.sid)
        
    def on_card(self, message):
        emit('my_card',
             {'x':message['x'],'y':message['y'],'id':message['id'],'front':message['front']},
             room=message['room'],
             broadcast=True)
        
    def on_askroomid(self):
        emit('askroomId',broadcast=True)
        
    def on_answerroomid(self,message):
        emit('roomIds',
             {'roomId':message['roomId']},
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
    socketio.run(app,debug=True)
