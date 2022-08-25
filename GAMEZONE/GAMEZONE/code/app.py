import email
import mimetypes
from database import Database
import re
from datetime import date, datetime
from flask import Flask, render_template, redirect, session, jsonify,request
from werkzeug.utils import secure_filename
from flask_json_schema import JsonSchema
import os
from datetime import date
import pytz
from comments import Comments
app = Flask(__name__, static_url_path='', static_folder='static')

db = Database()
app.secret_key = 'dljsaklqk24e21cjn!Ew@@dsa5'
UPLOAD_FOLDER = 'static/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
# Define page_accueil() function pour redirect le profil de l'utilisateur si login successful sinon retourne la page
# d'accueil
def page_accueil():
        error = None
        if request.method == 'POST':
            username= request.form['username']
            password =request.form['password']
            if db.valid_login(username,password):
                firstname = db.get_firstname_User(username).capitalize()
                lastname = db.get_lastname_User(username).capitalize()
                game1 = db.get_game("one",username)
                game2 = db.get_game("two",username)
                game3 = db.get_game("three",username)
                profil_image =  db.get_image(username)
                user_profile = []
                user_profile.append(firstname)
                user_profile.append(lastname)
                user_profile.append(game1)
                user_profile.append(game2)
                user_profile.append(game3)
                user_profile.append(profil_image)
                session["a"]=username
                #return render_template('profil.html', user_profile=user_profile)
                return redirect('/profil')
            else:
                error = 'Invalid username/password'
                return render_template('home.html', error=error)
        else:
            return render_template('home.html', error=error)
# Define feed() function pour retourner le feed de l'utilisateur connecté
@app.route('/feed', methods=['GET', 'POST'])
def feed():
    email = session.get("a",None)
    posts = db.get_all_post(email)
    comments = db.get_comment_by_count()
    return render_template('/feed.html',posts=posts,comments=comments)
# Define register() function pour retourner la page register
@app.route('/register', methods=['GET', 'POST'])
def register():
        temp = []
        x = 0
        while x < 7:
            temp.append('')
            x = x + 1
        today = date.today()
        d1 = today.strftime("%Y-%m-%d")
        return render_template('/register.html',temp=temp,minDate=d1)

@app.route('/gamechoice', methods=['GET', 'POST'] )
# Define gamechoice() function pour retourner les choix courrants ou enregistrer ses choix et redirect vers les
# préférencs de temps
def gamechoice():
        email = session.get("a",None)
        if request.method == 'GET':
            temp = []
            x = 0
            while x < 3:
                temp.append('')
                x = x + 1
            return render_template('/gamechoice.html',temp=temp)
        elif request.method == 'POST':
            game1 = request.form['game1']
            game2 = request.form['game2']
            game3 = request.form['game3']
            erreur = []
            temp = []
            bool = 0
            x = 0
            while x < 3:
                temp.append('')
                erreur.append('')
                x = x + 1
            if len(game1) == 0:
                erreur[0] = 'This field is mandatory'
                bool = 1
            else:
                temp[0] = game1
            if len(game2) == 0:
                erreur[1] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[1] = game2
            if len(game3) == 0:
                erreur[2] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[2] = game3
            if bool == 1:
                return render_template('/gamechoice.html', erreur=erreur,temp=temp)
            else:
               db.set_games(game1,game2,game3,email)
               return redirect('/timechoice')

@app.route('/new', methods=['POST'])
# Define post_form() function pour enregistrer ses informations personnelles et redirect ensuite vers les choix de jeux
def post_form():
    x = 0
    password = request.form['password']
    passwordconf = request.form['passwordconf']
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    birthday = request.form['birthday']
    phone = request.form['phone']
    genre = ''
    langue = ''
    id = db.counter() + 1
    erreur = []
    temp = []
    bool = 0

    while x < 7:
        temp.append('')
        erreur.append('')
        x = x + 1
    if len(firstname) == 0:
        erreur[0] = 'This field is mandatory'
        bool = 1
    else:
        temp[0] = firstname
    if len(lastname) == 0:
        erreur[1] = 'This field is mandatory'
        bool = 1
    else:
        erreur.append('')
        temp[1] = lastname
    if len(email) == 0:
        erreur[2] = 'This field is mandatory'
        bool = 1
    elif db.exist(email) == True:
        erreur[2] = 'This email is already registred'
        bool = 1
    else:
        erreur.append('')
        temp[2] = email
    if len(birthday) == 0:
        erreur[3] = 'This field is mandatory'
        bool = 1
    else:
        erreur.append('')
        temp[3] = birthday
    if len(phone) == 0:
        erreur[4] = 'This field is mandatory'
        bool = 1
    else:
        erreur.append('')
        temp[4] = phone
    if len(password) == 0:
        erreur[5] = 'This field is mandatory'
        bool = 1
    elif len(passwordconf) == 0:
        erreur[6] = 'This field is mandatory'
        bool = 1
    elif password != passwordconf:
        erreur[6] = 'Please enter same password'
        erreur[5] = 'Please enter same password'
        bool = 1
    else:
        erreur.append('')
        temp[5] = password
        temp[6] = password
    if bool == 1:
        return render_template('/register.html', erreur=erreur,temp=temp)
    else:
        db.insert_User(
            str(id),
            firstname,
            lastname,
            password,
            email,
            phone,
            birthday,
            genre,
            langue,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
            )
        session["a"]=email

        return redirect('/gamechoice')

@app.route('/timechoice', methods=['GET', 'POST'] )
# Define timechoice() function pour enregistrer/afficher ses préférences de temps et redirect ensuite vers l'ajout de
# photo
def timechoice():
        email = session.get("a",None)
        if request.method == 'GET':
            temp = []
            x = 0
            while x < 3:
                temp.append('')
                x = x + 1
            return render_template('/horraire.html',temp=temp)
        elif request.method == 'POST':
            time1 = request.form['time1']
            time2 = request.form['time2']
            time3 = request.form['time3']
            erreur = []
            temp = []
            bool = 0
            x = 0
            while x < 3:
                temp.append('')
                erreur.append('')
                x = x + 1
            if len(time1) == 0:
                erreur[0] = 'This field is mandatory'
                bool = 1
            else:
                temp[0] = time1
            if len(time2) == 0:
                erreur[1] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[1] = time2
            if len(time3) == 0:
                erreur[2] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[2] = time3
            if bool == 1:
                return render_template('/gamechoice.html', erreur=erreur,temp=temp)
            else:
               db.set_times(time1,time2,time3,email)
               return redirect('/pictureadd')

@app.route('/pictureadd', methods=['GET', 'POST'] )
# Define pictureadd() function pour ajouter une photo de profil et redirect vers son profil
def pictureadd():
        email = session.get("a",None)
        if request.method == 'GET':
                return render_template('/pictureadd.html')
        elif  request.method == 'POST':
                file = request.files['file']
                if file == '':
                        erreur = "No picture loaded"
                        return redirect('/pictureadd',erreur=erreur)
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                filename = "uploads/" + secure_filename(file.filename)
                db.set_img(filename,email)
                return redirect('/profil')

@app.route('/add_post', methods=[ 'POST'] )
# Define add_post() function pour ajouter un post sur son profil et ensuite recharger le profil
def add_post():
    if request.method == 'POST':
        timezone = pytz.timezone("America/Toronto")
        currentemail = session.get("a",None)
        id_current = db.get_user_by_email(currentemail)[0]
        contenu = request.form['post_contenu']
        now = datetime.now(tz = timezone)
        file = request.files['file']
        if file == '':
                erreur = "No picture loaded"
                return redirect('/profil')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        filename = "../uploads/" + secure_filename(file.filename)
        firstname = db.get_user_by_email(currentemail)[3]
        lastname = db.get_user_by_email(currentemail)[4]
        user_pic = '../'+db.get_user_by_email(currentemail)[15]
        db.add_post(contenu,filename,id_current,now,firstname,lastname,user_pic)
    return redirect('/profil')

@app.route("/api/get-comments/<id_post>", methods=['GET'])
# Define get_comments() function pour retourner/afficher les commentaires sous un post en argument.
def get_comments(id_post):
    print('test')
    comments = db.get_comment_by_count(id_post)
    return jsonify([comment.all_info() for comment in comments])

@app.route('/add_comment/<id_post>', methods=[ 'POST'] )
# Define add_comment() function pour enregister un commentaire sur un post et redirect vers le profil
def add_comment(id_post):
    if request.method == 'POST':
        currentemail = session.get("a",None)
        firstname = db.get_firstname_User(currentemail).capitalize()
        lastname = db.get_lastname_User(currentemail).capitalize()
        picture = db.get_image(currentemail)
        picture = '../' + picture
        timezone = pytz.timezone("America/Toronto")
        now = datetime.now(tz = timezone)
        contenu = request.form['post_comment']
        db.add_comment(id_post,currentemail,contenu,now,firstname,lastname,picture)
    return redirect('/profil')

@app.route('/profil', methods=['GET', 'POST'] )
# Define profil() function pour retourner un profil
def profil():
        email = session.get("a",None)
        if request.method == 'GET':
            firstname = db.get_firstname_User(email).capitalize()
            lastname = db.get_lastname_User(email).capitalize()
            game1 = db.get_game("one",email)
            game2 = db.get_game("two",email)
            game3 = db.get_game("three",email)
            profil_image =db.get_image(email)
            user_profile = []
            user_profile.append(firstname)
            user_profile.append(lastname)
            user_profile.append(game1)
            user_profile.append(game2)
            user_profile.append(game3)
            user_profile.append(profil_image)
            posts = db.get_posts_by_id(db.get_user_by_email(email)[0])
            comments = db.get_comment_by_count()
            return render_template('/profil.html',user_profile=user_profile,posts=posts,comments=comments)
        if request.method == 'POST':
            form = request.form['searchVal']
            result = db.search(form)
            return render_template('/resultat.html', data=result)

@app.route('/friendlist', methods=['GET', 'POST'] )
# Define friendlist() function pour retourner la liste d'amis
def friendlist():
    email = session.get("a",None)
    data = db.get_friend_list(email)
    friendlist = []
    for item in data:
        print(item)
        friendlist.append(db.get_user_by_email(item))
    return render_template('/resultat.html', data=friendlist)

@app.route('/search/<identifiant>', methods=['GET', 'POST'] )
# Define search() function pour rechercher un utilisateur et retourner le profil de cet utilisateur
def search(identifiant):
    data = db.get_user_by_id(identifiant)
    requestemail= data[1]
    imgsrc = '../' + data[15]
    currentemail = session.get("a",None)
    comments = db.get_comment_by_count()
    posts = db.get_posts_by_id(db.get_user_by_email(requestemail)[0])
    if request.method == 'POST':
        print('post')
        form = request.form['searchVal']
        result = db.search(form)
        return render_template('/resultat.html', data=result)
    if request.method =='GET':
        if (currentemail == requestemail):
            return redirect('/profil')
        if db.is_pending(currentemail,requestemail):
            pending='ok'
            return render_template ('search.html',data=data,pending=pending,imgsrc=imgsrc )

        if db.is_friend(currentemail,requestemail):
            message='ok'
            return render_template('/search.html',data=data,message=message,imgsrc=imgsrc,comments=comments,posts=posts)
        else:
            ajout ='ok'
            print(db.is_friend(currentemail,requestemail))
            return render_template('/search.html',data=data,ajout=ajout,imgsrc=imgsrc)

@app.route('/addfriend/<id>', methods=['GET', 'POST'])
# Define addfriend() function pour faire une demande d'ami à un utilisateur et retourner ensuite le profil de
# l'utilisateur avec le nouveau status d'amitié
def addfriend(id):
    currentemail = session.get("a",None)
    data = db.get_user_by_id(id)
    requestemail= data[1]
    db.addFriend(currentemail,requestemail)
    return redirect('/search/'+id)

@app.route('/edit', methods=['GET', 'POST'])
# Define edit() function pour modifier son profil dans la page edit et retourner le profil modifié
def edit():
    if request.method == 'GET':
        return render_template('/edit.html')
    if request.method == 'POST':
        x = 0
        password = request.form['password']
        passwordconf = request.form['passwordconf']
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        phone = request.form['phone']
        genre = ''
        langue = ''
        id = db.counter() + 1
        erreur = []
        temp = []
        bool = 0
        while x < 5:
            temp.append('')
            erreur.append('')
            x = x + 1
        if password != passwordconf:
            erreur[2] = 'Please enter same password'
            erreur[3] = 'Please enter same password'
            bool = 1
        else:
            erreur.append('')
            temp[2] = password
            temp[3] = password
        if bool == 1:
            return render_template('/edit.html', erreur=erreur,temp=temp)
        else:
            email = session.get("a",None)
            if len(firstname) > 0:
                db.set_firstname(firstname,email)
            if len(firstname) > 0:
                db.set_lasttname(lastname,email)
            if len(passwordconf) > 0:
                db.set_password(password,email)
            if len(phone) > 0:
                db.set_phone(phone,email)
            firstname = db.get_firstname_User(email).capitalize()
            lastname = db.get_lastname_User(email).capitalize()
            game1 = db.get_game("one",email)
            game2 = db.get_game("two",email)
            game3 = db.get_game("three",email)
            profil_image =db.get_image(email)
            user_profile = []
            user_profile.append(firstname)
            user_profile.append(lastname)
            user_profile.append(game1)
            user_profile.append(game2)
            user_profile.append(game3)
            user_profile.append(profil_image)
            return render_template('/profil.html',user_profile=user_profile)

@app.route('/demandeami/', methods=['GET', 'POST'] )
# Define demandeami() function pour retourner la liste des demandes d'amitiés en cours
def demandeami():
        email = session.get("a",None)
        datas=db.friendrequest(email)
        data = []
        for item in datas:
            emailtemp = item[0]
            print(emailtemp)
            datatemp = db.get_user_by_email(emailtemp)
            data.append(datatemp)
        return render_template('/demandeami.html',data=data)

@app.route('/approuve/<identifiant>', methods=['GET', 'POST'] )
# Define approuve() function pour accepter une demande d'ami et retourner les demandes en cours
def approuve(identifiant):
    email = session.get("a",None)
    db.approuv_friend(email,identifiant)
    return redirect ('/demandeami')

@app.route('/editgame', methods=['GET', 'POST'] )
# Define editgame() function pour modifier ses choix de jeux favoris et retourner le profil
def editgame():
        email = session.get("a",None)
        if request.method == 'GET':
            temp = []
            x = 0
            while x < 3:
                temp.append('')
                x = x + 1
            return render_template('/editgamechoice.html',temp=temp)
        elif request.method == 'POST':
            game1 = request.form['game1']
            game2 = request.form['game2']
            game3 = request.form['game3']
            erreur = []
            temp = []
            bool = 0
            x = 0
            while x < 3:
                temp.append('')
                erreur.append('')
                x = x + 1
            if len(game1) == 0:
                erreur[0] = 'This field is mandatory'
                bool = 1
            else:
                temp[0] = game1
            if len(game2) == 0:
                erreur[1] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[1] = game2
            if len(game3) == 0:
                erreur[2] = 'This field is mandatory'
                bool = 1
            else:
                erreur.append('')
                temp[2] = game3
            if bool == 1:
                return render_template('/gamechoice.html', erreur=erreur,temp=temp)
            else:
                db.set_games(game1,game2,game3,email)
                firstname = db.get_firstname_User(email).capitalize()
                lastname = db.get_lastname_User(email).capitalize()
                game1 = db.get_game("one",email)
                game2 = db.get_game("two",email)
                game3 = db.get_game("three",email)
                profil_image =db.get_image(email)
                user_profile = []
                user_profile.append(firstname)
                user_profile.append(lastname)
                user_profile.append(game1)
                user_profile.append(game2)
                user_profile.append(game3)
                user_profile.append(profil_image)
            return render_template('/profil.html',user_profile=user_profile)

@app.route('/messages', methods=['GET', 'POST'] )
# Define messages() function pour retourner la page des messages
def messages():
    return render_template('/messages.html')