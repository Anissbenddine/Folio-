import os
from pydoc import cli
from database import Database
from flask import Flask, render_template, request, jsonify
from datetime import date
import requests
import pandas as pd
import xml.etree.ElementTree as ET
import re
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from flask_json_schema import JsonSchema
from installation import Installation
from piscine import Piscine
from glissade import Glissade
from patinoire import Patinoire
import smtplib, ssl
import tweepy
import yaml
from yaml.loader import SafeLoader

#----------------------- VARIABLES GLOBALES -----------------------#

nouvelles_installations = "Les nouvelles installations sont :  \n" 
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
email_login = 'projectsessioninf5190@gmail.com'
email_password = 'inf_5190'
email_receiver = 'benddine.aniss@gmail.com'

email_coor = [{'EMAIL':email_receiver}]

#ecriture de l'adresse email dans le fichier YAML
with open('config.yaml', 'w') as f:
    data = yaml.dump(email_coor, f, sort_keys=False, default_flow_style=False)

EMAIL_SUBJECT = "Nouvelles Installations"
client = tweepy.Client(consumer_key="415Vrg5clON0N8xewgvzoVC46",consumer_secret="MKonhBR8aJRL8AJvez3RKkH7MmHz0Wj4u6ISPuPg23AcdFDwgc",
                access_token="1515551157875363844-ENy8NZ9IPLtpiBZLfEUXtYKMSZRBBV",access_token_secret="Z2yhkfEC2skJRt7YWltuAUKFp0hy6gAdAX2FN7r7pxoux")
                
nbr_update = 0
scheduler = BackgroundScheduler()
app = Flask(__name__, static_url_path='', static_folder='static')
schema = JsonSchema(app)
db = Database()
url_piscines = 'https://data.montreal.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv'
url_patinoires= 'https://data.montreal.ca/dataset/225ac315-49fe-476f-95bd-a1ce1648a98c/resource/5d1859cc-2060-4def-903f-db24408bacd0/download/l29-patinoire.xml'
url_airJeux= 'http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml'

#----------------------- VARIABLES GLOBALES -----------------------#



#----------------------- FONCTIONS DIVERSES -----------------------#


#Fonction d'initialisation et de mise a jour
def init():
    #on recupere le contenue des fichiers depuis les urls et on les stocks dans des variables
    r_piscine = requests.get(url_piscines, allow_redirects=True)
    r_patinoires = requests.get(url_patinoires, allow_redirects=True)
    r_airJeux = requests.get(url_airJeux, allow_redirects=True)

    #On ecrit le contenu des fichiers sur des fichiers en local
    open('piscines.csv', 'wb').write(r_piscine.content)
    open('patinoires.xml', 'wb').write(r_patinoires.content)
    open('airJeux.xml', 'wb').write(r_airJeux.content)

    #On parse les fichiers
    data_piscines = pd.read_csv ('piscines.csv')
    data_airJeux = ET.parse('airJeux.xml')
    data_patinoires= ET.parse('patinoires.xml')
    root_airJeux = data_airJeux.getroot()
    root_patinoires= data_patinoires.getroot()
    df_piscines = pd.DataFrame(data_piscines)
    df_piscines=df_piscines.drop_duplicates()

    #On recupere les arrondissements
    for row in df_piscines.itertuples():
        arr_pi = re.sub(r"^\s+|\s+$", "", row.ARRONDISSE).replace(' ','')
        if(db.exist('arrondissement','nom',arr_pi) == False):
            db.insert_arr(arr_pi)
    for nomArr in root_airJeux.iter('nom_arr'):
        arr_glissade = re.sub(r"^\s+|\s+$", "",nomArr.text).replace(' ','')
        if(db.exist('arrondissement','nom',arr_glissade) == False):
            db.insert_arr(arr_glissade)
    for nomArr in root_patinoires.iter('nom_arr'):
        arr_pat = re.sub(r"^\s+|\s+$", "",nomArr.text).replace(' ','')
        if(db.exist('arrondissement','nom',arr_pat) == False):
            db.insert_arr(arr_pat)

    #On injecte les piscines dans la base de donnes si la psicine existe deja on ne l'injecte pas on verifie cela avec les longitudes et latitudes        
    for row in df_piscines.itertuples():
        if(db.exist("piscines","long",str(row.LONG)) == False and db.exist("piscines","lat",str(row.LAT)) == False ):
            arondissement_piscine = re.sub(r"^\s+|\s+$", "", row.ARRONDISSE).replace(' ','')
            if(nbr_update >0 ):
                nouvelles_installations = nouvelles_installations + row.NOM + " ( Piscine ) a " + row.ARRONDISSE  +"\n"
            db.insert_piscine(row.TYPE,row.NOM,arondissement_piscine,row.ADRESSE,row.PROPRIETE,row.GESTION,row.POINT_X,row.POINT_Y,row.EQUIPEME,row.LONG,row.LAT)    

    #On injecte les glissades dans la base de donnes si la glissade existe deja on ne l'injecte pas on verifie cela avec le nom        
    for row in root_airJeux.iter('glissade'):
        nom = ''
        ouvert = ''
        deblaye = ''
        condition = ''
        arrondissement = ''
        date_maj = date(1800,1,1)
        for child in row:
            if(child.tag == 'nom'):
                nom = child.text
            if(child.tag == 'ouvert'):
                ouvert = child.text
            if (child.tag == 'deblaye'): 
                deblaye = child.text
            if (child.tag == 'condition'):
                condition = child.text
            if (child.tag == 'arrondissement'):
                arr = ''
                for son in child:
                    if(son.tag == 'nom_arr'):
                        arr = son.text
                    if(son.tag == 'date_maj'):
                        date_maj = datetime.strptime(son.text, "%Y-%m-%d %H:%M:%S")    
                arrondissement=arr
        #Si la glissade existe deja on ne l'injecte pas 
        # Si la glissade existe mais que la date de mise a joure est plus recente on l'injecte        
        if(db.exist("airesJeux","nom",str(nom)) == False or (db.exist("airesJeux","nom",str(nom))== True and date_maj < datetime.strptime(db.get_date_heure_glissade(nom), "%Y-%m-%d %H:%M:%S")) ):
            arondissement_glissade = re.sub(r"^\s+|\s+$", "", arrondissement).replace(' ','')
            if(nbr_update >0 ):
                nouvelles_installations = nouvelles_installations + nom + " ( Glissade ) a " + arrondissement +"\n"
            db.insert_air_jeux(nom,ouvert,deblaye,condition,arondissement_glissade,date_maj)

    #On injecte les patinoires dans la base de donnes si la glissade existe deja on ne l'injecte pas on verifie cela avec le nom
    for row in  root_patinoires.iter('arrondissement'):
        date_heure_temp = datetime(1800, 12, 16)
        nom_arr = ''
        nom_pat = ''
        date_heure= datetime(1800, 12, 16)
        ouvert = 0
        deblaye = 0
        arrose = 0
        resurface = 0
        for child in row:
            if(child.tag == 'nom_arr' ): 
                nom_arr= re.sub(r"^\s+|\s+$", "",child.text).replace(' ','')
            if(child.tag == 'patinoire'):
                for items in child:
                    
                    if(items.tag == 'nom_pat'):
                        #Si la patinoire existe deja on ne l'injecte pas 
                        # Si la patinoire existe mais que la date de mise a joure est plus recente on l'injecte 
                        if(db.exist("patinoires","nom",str(nom_pat)) == False and nom_pat!='' or (db.exist("patinoires","nom",str(nom_pat)) == True) and date_heure < datetime.strptime(db.get_date_heure_patinoire(nom_pat), "%Y-%m-%d %H:%M:%S")  ):
                            db.insert_patinoires(nom_pat,ouvert,deblaye,resurface,nom_arr,arrose,date_heure) 
                            if(nbr_update >0 ):
                                nouvelles_installations = nouvelles_installations + nom_pat + " ( Glissade ) a " + nom_arr +"\n"                         
                        nom_pat =re.sub(r"^\s+|\s+$", "",items.text)
                    else:
                        date_heure = date_heure_temp
                        for kid in items:
                            if(kid.tag == 'date_heure'):                          
                                date_heure_temp = datetime.strptime(re.sub(r"^\s+|\s+$", "", kid.text), "%Y-%m-%d %H:%M:%S")
                            if(date_heure_temp > date_heure):
                                if(kid.tag == 'ouvert'):
                                    ouvert = re.sub(r"^\s+|\s+$", "",kid.text)
                                if(kid.tag == 'deblaye'):
                                    deblaye = re.sub(r"^\s+|\s+$", "",kid.text)        
                                if(kid.tag == 'arrose'):
                                    arrose = re.sub(r"^\s+|\s+$", "",kid.text)
                                if(kid.tag == 'resurface'):
                                    resurface = re.sub(r"^\s+|\s+$", "",kid.text)  
            

#Fonction Qui lance la mise a jour (Base de donne et documentation) 
# et l'envoie de mail et de tweet en cas de nouvelles installations
def update():
    init()
    #MISE A JOUR DE LA DOCUMENTATION
    os.system("raml2html doc.raml > templates/doc.html")
    if(nbr_update > 1 and nouvelles_installations != "Les nouvelles installations sont :  \n" ):
        context = ssl.create_default_context()

        # ----- ENVOI DU MAIL CONTENANT LES NOUVELLES INSTALLATIONS ----- #
        s = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        s.starttls()
        s.login(email_login, email_password)
        message = 'Subject: {}\n\n{}'.format(EMAIL_SUBJECT, nouvelles_installations)
        s.sendmail(email_login,email_receiver, message)
        s.quit()
        # ----- ENVOI DU MAIL CONTENANT LES NOUVELLES INSTALLATIONS ----- #

        #ENVOI DU TWEET CONTENANT LES NOUVELLES INSTALLATIONS
        response = client.create_tweet(text=nouvelles_installations)
        nouvelles_installations = "Les nouvelles installations sont :  \n"


#Si la basse de donne est vide on initialise l'import de donnees
if(db.counter()==0):
    init()
    #si la base de donne est deja remplie on lance la mise a jour automatique
    #chaque 00h00mn de chaque journee en lancant la fonction update()
else:
    nbr_update += 1
    scheduler.add_job(update, trigger = 'cron', hour = '00', minute = '00')
    scheduler.start()
    
    
#----------------------- FONCTIONS DIVERSES -----------------------#


#----------------------- ROUTES ET SERVICES REST -----------------------#

#Route qui affiche la documentation des services REST
@app.route('/doc', methods=['GET'])
def doc(): 
    return render_template('doc.html')

#Route page d'accueil
@app.route('/', methods=['GET', 'POST'])
def page_accueil():
    if request.method == 'GET':
        arr = db.get_arrondissements()
        piscines = db.get_pisicnes()
        patinoires = db.get_patinoires()
        glissades = db.get_glissades()
        install= []
        for x in piscines:
            install.append(x)
        for x in glissades:
            install.append(x)
        for x in patinoires:
            install.append(x)    
        return render_template('home.html',arr = arr,install=install)
    if request.method == 'POST':
        return render_template('home.html')     

#Service REST permettant d'obtenir la liste des installations 
# pour un arrondissement spécifié en paramètre. 
#  Les données retournées sont en format JSON. 
@app.route("/api/installations", methods=['GET'])
def get_installations_arr():
        arrondissement=request.args.get("arrondissement")
        instals = db.get_installations(arrondissement)
        if instals is None:
            return "aucune Installation",403
        else:
            return jsonify([instal.all_info() for instal in instals])

#Service REST permettant d'obtenir la liste informations connues de l'installations spécifié . 
# Les données retournées sont en format JSON.
@app.route("/api/info-installations", methods=['GET'])
def get_info_installation():
        installation=request.args.get("installation")
        instals = db.get_installations_by_nom(installation)
        if instals == None:
            return "aucune Installation",403
        else:
            return jsonify(instals.all_info())

#Service REST permettant d'obtenir la liste des installations par leur type
#  Pour chaque installation, on indique toute l'information connue. 
#   La liste est triée en ordre croissant du nom de l'installation.
#    Les données retournées sont en format JSON.
@app.route("/api/type-installations", methods=['GET'])
def get_installations_type():
        type=request.args.get("type_install")
        if (type == "piscines" ):
            piscines = db.get_all_piscines()
            if piscines == None:
                return "aucune Installation",403
            else:
                return jsonify([piscine.all_info() for piscine in piscines])
        if (type == "glissades" ):
            glissades = db.get_all_glissades()
            if glissades == None:
                return "aucune Installation",403
            else:
                return jsonify([glissade.all_info() for glissade in glissades])
        if (type == "patinoires" ):
            patinoires = db.get_all_patinoires()    
            if patinoires == None:
                return "aucune Installation",403
            else:
                return jsonify([patinoire.all_info() for patinoire in patinoires])

#----------------------- ROUTES ET SERVICES REST -----------------------#


