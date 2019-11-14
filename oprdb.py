# 必要モジュールをインポートする
import os
import psycopg2
import datetime

def connectdb():
    DATABASE_URL=os.environ['DATABASE_URL']
    return psycopg2.connect(DATABASE_URL,sslmode='require')
    
# テーブルの作成
def maketable():
    con = connectdb()
    cur = con.cursor()
    cur.execute('''CREATE TABLE rooms(num integer, mem integer, date text)''')
    con.commit()
    con.close()
    

def addroom(num):
    date=datetime.date.today()
    date.strftime('%Y%m%d')
    con = connectdb()
    cur = con.cursor()
    cur.execute("INSERT INTO rooms(num, mem, date) VALUES (?, ?, ?)", (num,1,date))
    con.commit()
    con.close()

def addmember(num):
    con = connectdb()
    cur = con.cursor()
    cur.execute("UPDATE rooms SET mem = mem+1 WHERE num = (?)",(num,))
    con.commit()
    con.close()
    
def redmember(num):
    con = connectdb()
    cur = con.cursor()
    cur.execute("UPDATE rooms SET mem = mem-1 WHERE num = (?)",(num,))
    data=cur.execute("SELECT mem FROM rooms WHERE num == (?)",(num,))
    res=data.fetchone()
    if(res!=None):
        mem=res[0]
        if(mem>0):
            con.commit()
            con.close()
        else:
            con.close()
            deleteroom(num)
    else:
        con.close()
        
    
def deleteroom(num):
    con = connectdb()
    cur = con.cursor()
    cur.execute("DELETE FROM rooms WHERE num = (?)",(num,))
    con.commit()
    con.close()

def sendrooms():
    con = connectdb()
    cur = con.cursor()
    data=cur.execute("SELECT num FROM rooms ORDER BY num ASC")
    res=[dict(num=row[0])for row in data.fetchall()]
    con.close()
    rooms=[d.get('num')for d in res]
    return rooms


def sendall():
    con = connectdb()
    cur = con.cursor()
    data=cur.execute("SELECT * FROM rooms ORDER BY num ASC")
    res=[dict(num=row[0],mem=row[1],date=row[2])for row in data.fetchall()]
    con.close()
    return res


if __name__ == '__main__':
    maketable()
    #closedb()
    #addroom(3)
    #redmember(3)
    #deleteroom(3)
    #addmember(3)
    #print(sendall())
    
