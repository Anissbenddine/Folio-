from itertools import count
import sqlite3
from xml.etree.ElementTree import Comment
from comments import Comments
class Database():
    post_count = 0
    # Definir le constructeur de la classe
    def __init__(self):
        self.connection = None

    # Definir une connexion avec la base de données
    def get_connection(self):
        if self.connection is None:
            self.connection = sqlite3.connect("db/database.db", check_same_thread=False)
        return self.connection

    def get_user_by_id(self, id):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select * from User where id=" + id)
        result = cursor.fetchall()
        self.disconnect()
        return result[0]

    def get_id_by_email(self, email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select id from User where email=" + "\"" + email + "\"")
        result = cursor.fetchall()
        self.disconnect()
        return result
        
    def get_user_by_email(self, email):
        con = self.get_connection()
        emailtemp= str(email)
        cursor = con.cursor()
        cursor.execute('select * from User where email='+ "'" + emailtemp+ "'")
        result = cursor.fetchall()
        self.disconnect()
        return result[0]

    def approuv_friend(self,current,friend):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE friends SET etat=" + "'" + "friend" + "'" + "WHERE friend= '" + current + "' and  current=" + "'" + friend + "'" )
        cursor.execute("UPDATE friends SET etat=" + "'" + "friend" + "'" + "WHERE friend= '" + friend + "' and  current=" + "'" + current + "'" )
        con.commit()
        self.disconnect()

    def friendrequest(self, current):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select * from friends where friend =" + "'" + current + "'" + "and etat=" + "'pending'")
        result = cursor.fetchall()
        self.disconnect()
        return result

    def add_post(self,text_post,img_post,id,date,firstname,lastname,user_pic):
        con = self.get_connection()
        cursor = con.cursor()
        self.post_count = self.post_count +1
        count = self.post_count 
        cursor.executescript(("insert into post"
                          "(id_count,contenu,pic_name,id_current,post_date,firstname,lastname,pictureUser) "
                          "values(\"" + str(count) + "\","+ "\"" +str(text_post) + "\","+ "\"" + str(img_post) + "\","+ "\"" + str(id)+ "\","+ "\""  + str(date)  +  "\","+ "\"" +str(firstname) + "\","+ "\"" + str(lastname) + "\","+ "\"" + str(user_pic)+"\")" ))
        con.commit()

    def add_comment(self,id_post,email,contenu,date,firstname,lastname,picture):
        con = self.get_connection()
        cursor = con.cursor()      
        cursor.executescript(("insert into comment"
                          "(contenu,id_current_post,email_current_user,comment_date,firstname,lastname,picture) "
                          "values(\"" + str(contenu) + "\","+ "\"" +str(id_post) + "\","+ "\"" + str(email)+ "\","+ "\""  + str(date)  + "\","+ "\"" + str(firstname) + "\","+ "\"" + str(lastname)  + "\","+ "\"" + str(picture)+"\")" ))
        con.commit()    

    def get_posts_by_id(self,id):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select * from post where id_current =" + "'" +str(id)+ "'" )
        result = cursor.fetchall()
        self.disconnect()
        return result

    def get_friend_list(self,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor2 = con.cursor()
        cursor.execute('select * from friends where current='+ "'" + email+ "'"   +' and etat=' + "'" + "friend" + "'")
        cursor2.execute('select * from friends where friend='+ "'" + email+ "'"  +' and etat=' + "'" + "friend" + "'" )
        result = cursor.fetchall()
        result2= cursor2.fetchall()
        final_result=[]
        if result != None :
            for item in result:
                final_result.append(item[1])
        if result2 != None :        
            for item in result2:
                final_result.append(item[0])    
        self.disconnect()
        return final_result    
    
    def get_all_post(self,email):
        
        id_friends = []
        friends =  self.get_friend_list(email)
        for friend in friends:
            id_friends.append(self.get_id_by_email(friend))
        str_id = ''
        for id in id_friends:
            str_id = str_id + str(id[0][0]) + ','
        con = self.get_connection()
        cursor = con.cursor()    
        str_id = str_id[:-1]
        print(str_id)
        cursor.execute("select * from post  where id_current in (" + str_id + ")")
        result = cursor.fetchall()
        self.disconnect()
        return result

    def get_comment_by_count(self):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select * from comment " )
        results = cursor.fetchall()
        self.disconnect()
        return (results)

    
    def is_friend(self,current, friend):
        con = self.get_connection()
        cursor = con.cursor()
        cursor2 = con.cursor()
        cursor.execute('select * from friends where current='+ "'" + current+ "'" +' and friend=' +  "'" + friend + "'" +' and etat=' + "'" + "friend" + "'" )
        cursor2.execute('select * from friends where current='+ "'" + friend + "'" +' and friend=' +  "'" + current + "'" +' and etat=' + "'" + "friend" + "'" )
        result = cursor.fetchone()
        result2= cursor2.fetchone()
        self.disconnect()
        if result is None and result2 is None :
            return False
        else:
            return True

    def is_pending(self,current, friend):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select * from friends where current= '+ "'" + current + "'" + '  and friend= ' + "'" + friend +"'" + '  and etat=  \'pending\'' )
        result = cursor.fetchone()
        self.disconnect()
        if result is None:
            return False
        else:
            return True

    def addFriend(self,current,friend):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("insert into friends values (\"" + current + "\", \"" + friend + "\", \"" + "pending" + "\")")       
        con.commit()

    def valid_login(self,username, password):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select * from User where email='+ "'" + username+ "'" +' and motpasse=' +  "'" + password + "'" )
        result = cursor.fetchone()
        self.disconnect()
        if result is None:
            return False
        else:
            return True
    
    def exist(self,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select * from User where email='+ "'" + email+ "'" )
        result = cursor.fetchone()
        self.disconnect()
        if result is None:
            return False
        else:
            return True
    # Deconnexion de la base de données
    def disconnect(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None

    def search(self, val):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select * from User where firstname LIKE " + "'%" + val + "%'" + "OR lastname LIKE " + "'%" + val + "%'")
        result = cursor.fetchall()
        self.disconnect()
        return result

    def get_firstname_User(self, email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select firstname from User where email= '" + email+ "'")
        result = cursor.fetchone()
        self.disconnect()
        return result[0]
        
    def get_game(self,num, email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select game" +num+ " from User where email= '" + email+ "'")
        result = cursor.fetchone()
        self.disconnect()
        return result[0]

    def get_lastname_User(self, email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select lastname from User where email= '" + email + "'")
        result = cursor.fetchone()
        self.disconnect()
        return result[0]    

    def get_image(self, email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("select imgname from User where email= '" + email + "'")
        result = cursor.fetchone()
        self.disconnect()
        return result[0] 

    def set_games(self, game1, game2, game3,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET gameone=\"" + game1 + "\", gametwo=\"" + game2 + "\", gamethree=\"" + game3 + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()

    def set_img(self, imgname,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET imgname=\"" + imgname + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()

    def set_firstname(self, firstname,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET firstname=\"" + firstname + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()

    def set_lasttname(self, lastname,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET lastname=\"" + lastname + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()

    def set_password(self, password,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET motpasse=\"" + password + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()    

    def set_phone(self, phone,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET phone=\"" + phone + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()    
        
    def set_times(self, time1, time2, time3,email):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("UPDATE User SET timeone=\"" + time1 + "\", timetwo=\"" + time2 + "\", timethree=\"" + time3 + "\" WHERE email= '" + email + "'")
        con.commit()
        self.disconnect()

    def insert_User(self, id, firstname, lastname, password, email, phone,birthday,genre,langue,game1,game2,game3,time1,time2,time3,img,imgname,mimetype):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("insert into User values (\"" + id + "\", \"" + email + "\", \"" + password + "\", \"" + firstname + "\", \"" + lastname + "\", \"" + birthday + "\", \"" + genre + "\", \"" + phone + "\", \"" + langue + "\", \"" +game1+"\", \""+ game2+"\", \"" + game3 + "\", \"" + time1 +"\", \""+time2 +"\", \"" + time3 + "\", \"" + imgname + "\")")
        con.commit()

    def counter(self):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("SELECT COUNT(*) FROM User")
        result = cursor.fetchone()[0]
        self.disconnect()
        return result