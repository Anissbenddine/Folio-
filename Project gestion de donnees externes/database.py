from cgitb import reset
import sqlite3
from glissade import Glissade
from installation import Installation
from piscine import Piscine
from patinoire import Patinoire
class Database():

    # Definir le constructeur de la classe
    def __init__(self):
        self.connection = None

    # Definir une connexion avec la base de données
    def get_connection(self):
        if self.connection is None:
            self.connection = sqlite3.connect("db/database.db")
        return self.connection

    # Deconnexion de la base de données
    def disconnect(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None

    # Fonction qui permet l'injection d'un nouvel arrondissement dans la table arrondissement
    def insert_arr(self,nom):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.executescript(("insert into arrondissement"
                          "(nom) "
                          "values(\"" + nom + "\")" ))
        con.commit()
        
    # Fonction qui permet de verifier l'existance d'une valeur dans une table donnee
    #   @table: dans quelle table verifier l'existance de cette valeur
    #   @field: avec quelle champ comparer la variable
    #   @val: variable a aller chercher dans les champs de la table specifiee

    def exist(self,table,field,val):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select '+ field +' from '+ table +' where '+ field +'=' + "\"" + val+ "\"" )
        result = cursor.fetchone()
        self.disconnect()
        if result is None:
            return False
        else:
            return True    

    # Fonction qui retourne tous les champs de la table arrondissement
    def get_arrondissements(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM arrondissement")
        result = cursor.fetchall() 
        self.disconnect()
        return(result)     

    def get_arrondissement_by_id(self,id):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT nom FROM arrondissement where _idArr=?",(id,))
        patinoire = cursor.fetchone() 
        self.disconnect()
        return(patinoire)

    # Fonction qui retourne la date de mise a jour de la pationoire dont le nom a ete passe en parametre 
    def get_date_heure_patinoire(self,nom):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM patinoires where nom=?",(nom,))
        patinoire = cursor.fetchone() 
        self.disconnect()
        return(patinoire[7])    

    # Fonction qui retourne la date de mise a jour de la glissade dont le nom a ete passe en parametre
    def get_date_heure_glissade(self,nom):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM airesJeux where nom=?",(nom,))
        glissade = cursor.fetchone() 
        self.disconnect()
        return(glissade[6])        

    # Fonction qui permet l'injection d'une nouvelle piscine dans la table piscine
    def insert_piscine(self,type,nom,arr,adresse,propriete,gestion,pointx,pointy,equipement,long,lat):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select _idArr from arrondissement where nom=' + "\"" + arr+ "\"" )
        result = cursor.fetchone()[0]
        cursor.executescript(("insert into piscines"
                          "(type_piscine,nom,_idarrondissement_pi,adresse,propriete,gestion,point_X,point_Y,equipement,long,lat,type_install) "
                          "values(\"" + str(type) + "\","+ "\"" + str(nom) + "\","+ "\"" + str(result) + "\"," +"\"" +str(adresse)+ "\"," + "\""+ str(propriete)+"\"," + "\"" + str(gestion) + "\"," + "\"" + str(pointx) + "\","  + "\"" + str(pointy) +"\"," + "\"" +str(equipement)+"\"," + "\"" +str(long)+"\"," + "\"" +str(lat) + "\"," + " \"piscine\")" ))
        con.commit()        
    
    
    # Fonction qui permet l'injection d'une nouvelle aire de jeux dans la table airesJeux
    def insert_air_jeux(self,nom,ouvert,deblaye,condition,arrondissement,date_maj):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select _idArr from arrondissement where nom=' + "\"" + arrondissement+ "\"" )
        result = cursor.fetchone()[0]
        cursor.executescript(("insert into airesJeux"
                          "(nom,ouvert,deblaye,condition,_idarrondissement_air,date_maj,type_install) "
                          "values(\"" + str(nom) + "\","+ "\"" + str(ouvert) + "\"," +"\"" +str(deblaye)+ "\"," + "\""+ str(condition)+"\"," + "\"" + str(result) +  "\"," + "\""+ str(date_maj) + "\","+  " \"glissade\")" ))
        con.commit()

    # Fonction qui permet l'injection d'une nouvelle patinoire dans la table patinoires
    def insert_patinoires(self,nom,ouvert,deblaye,resurface,arrondissement,arrose,date_maj):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute('select _idArr from arrondissement where nom=' + "\"" + arrondissement+ "\"" )
        result = cursor.fetchone()[0]
        cursor.executescript(("insert into patinoires"
                          "(nom,ouvert,deblaye,resurface,_idarrondissement_pat,arrose,date_maj,type_install) "
                          "values(\"" + str(nom) + "\","+ "\"" + str(ouvert) + "\"," +"\"" +str(deblaye)+ "\"," + "\""+ str(resurface)+"\"," + "\"" + str(result) +  "\"," + "\""  + str(arrose) + "\"," + "\"" + str(date_maj) + "\"," + " \"patinoire\")" ))
        con.commit()        

    # Fonction qui retourne tous les champs de toutes les tables dont le FOREIGN KEY
    #   est egal a l'id de l'arrondissement passe en parametre
    #   @arondissement: parametre qui determine l'arrondissement des installations a chercher
    def get_installations(self,arrondissement):
        cursor = self.get_connection().cursor()
        cursor.execute('select _idArr from arrondissement where nom=' + "\"" + arrondissement+ "\"" )
        idArr= cursor.fetchone()[0]
        cursor.execute("select * from patinoires   where _idarrondissement_pat =" + "\"" + str(idArr) + "\"" )
        patinoires = cursor.fetchall()
        cursor.execute("select * from piscines   where _idarrondissement_pi =" + "\"" + str(idArr) + "\"" )
        piscines = cursor.fetchall()
        cursor.execute("select * from airesJeux   where _idarrondissement_air =" + "\"" + str(idArr) + "\"" )
        glissades= cursor.fetchall()
        noms = []
        for item in patinoires:
            noms.append(item[1])
        for item in glissades:
            noms.append(item[1])
        for item in piscines:
            noms.append(item[1])
        self.disconnect()
        return (Installation(result,arrondissement) for result in noms)


    # Fonction qui retourne une installation en la cherchant dans toutes les tables de la base de donnee
    # @nom: le nom de l'installation a chercher
    def get_installations_by_nom(self,nom):
        cursor = self.get_connection().cursor()
        # On verifie que si l'instalaltion est une piscine
        cursor.execute("select * from piscines  where nom =" + "\"" + nom + "\"" )
        result = cursor.fetchone()
        if result is None:
            cursor = self.get_connection().cursor()
            # On verifie que si l'instalaltion est une aire de jeux (glissade)
            cursor.execute("select * from airesJeux  where nom =" + "\"" + nom + "\"" )
            resultats = cursor.fetchone()
            if resultats is None:
                cursor = self.get_connection().cursor()
                # On verifie que si l'instalaltion est une patinoire
                cursor.execute("select * from patinoires  where nom =" + "\"" + nom + "\"" )
                resultat = cursor.fetchone()     
                if resultat is None:
                    return False
                else:
                    cursor.execute('select * from arrondissement where _idArr=' + "\"" + str(resultat[2])+ "\"" )
                    arr = cursor.fetchone()[1]
                    self.disconnect()
                    return (Patinoire(resultat[0],resultat[1],'patinoire',arr,resultat[3],resultat[4],resultat[6],resultat[5],str(resultat[7])))    
            else:
                cursor.execute('select * from arrondissement where _idArr=' + "\"" + str(resultats[2])+ "\"" )
                arrondissement_glissade = cursor.fetchone()[1]
                self.disconnect()
                return (Glissade(resultats[0],resultats[1],"glissade",arrondissement_glissade,resultats[3],resultats[4],resultats[5],str(resultats[6])))
        else:  
            cursor.execute('select * from arrondissement where _idArr=' + "\"" + str(result[2])+ "\"" )
            arr = cursor.fetchone()[1]
            self.disconnect()
            return (Piscine(result[0],result[1],arr,"piscine",result[4],result[5],result[6],result[9],result[10],result[11],result[7],result[8]))
            
    # Fonction qui compte le nombre d'arrondissements presents dans la table arrondissement
    def counter(self):
        con = self.get_connection()
        cursor = con.cursor()
        cursor.execute("SELECT COUNT(*) FROM arrondissement")
        result = cursor.fetchone()[0]
        self.disconnect()
        return result    

    # Fonction qui retourne tous les champs de la table piscines
    def get_pisicnes(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM piscines")
        result = cursor.fetchall() 
        self.disconnect()
        return(result) 

    # Fonction qui retourne tous les champs de la table airesJeux
    def get_glissades(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM airesJeux")
        result = cursor.fetchall() 
        self.disconnect()
        return(result)    

    # Fonction qui retourne tous les champs de la table patinoires
    def get_patinoires(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM patinoires")
        result = cursor.fetchall() 
        self.disconnect()
        return(result)    

    # Fonction qui retourne tous les champs de la table piscines sous format Object en les ordonnant par nom
    def get_all_piscines(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM piscines order by nom")
        results = cursor.fetchall()
        temp_result =[]
        for item in results:
            temp_result.append(list(item))
        for temp in temp_result:
            arr = self.get_arrondissement_by_id(temp[2])
            temp[2]=arr
        temp_results2 = tuple(temp_result)
        self.disconnect()
        
        return (Piscine(result[0],result[1],result[2],"piscine",result[4],result[5],result[6],result[9],result[10],result[11],result[7],result[8]) for result in temp_results2)     


    # Fonction qui retourne tous les champs de la table airesJeux sous format Object en les ordonnant par nom
    def get_all_glissades(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM airesJeux order by nom")
        results = cursor.fetchall() 
        temp_result =[]
        for item in results:
            temp_result.append(list(item))
        for temp in temp_result:
            arr = self.get_arrondissement_by_id(temp[2])
            temp[2]=arr
        temp_results2 = tuple(temp_result)
        self.disconnect()
        return (Glissade(result[0],result[1],"glissade",result[2],result[3],result[4],result[5],str(result[6])) for result in temp_results2)     

    # Fonction qui retourne tous les champs de la table patinoires sous format Object en les ordonnant par nom
    def get_all_patinoires(self):
        cursor = self.get_connection().cursor()
        cursor.execute("SELECT * FROM patinoires order by nom")
        results = cursor.fetchall()
        temp_result =[]
        for item in results:
            temp_result.append(list(item))
        for temp in temp_result:
            arr = self.get_arrondissement_by_id(temp[2])
            temp[2]=arr
        temp_results2 = tuple(temp_result)
        self.disconnect()
        return (Patinoire(result[0],result[1],"patinoire",result[2],result[3],result[4],result[6],result[5],str(result[7])) for result in temp_results2)    