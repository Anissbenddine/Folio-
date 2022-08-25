# Classe qui represente une piscine avec tous les champs disponibles dans le fichier CSV fournis 


class Piscine:
    def __init__(self, id, nom, arrondissement,type,adresse,propriete,gestion,equipement,long,lat,x,y):
        self.id = id
        self.nom = nom
        self.arrondissement = arrondissement
        self.type = type
        self.propriete = propriete
        self.gestion = gestion
        self.equipement = equipement
        self.long = long
        self.lat = lat
        self.x = x
        self.y = y
        self.adresse = adresse

    def set_id(self, id):
        self.id = id


    def min_info(self):
        return {
            'id' : self.id,
            'nom' : self.nom,
            'arrondissement' : self.arrondissement,
        }    


    def all_info(self):
        return {
            'id' : self.id,
            'nom' : self.nom,
            'arrondissement' : self.arrondissement,
            'type' : self.type,
            'propriete' : self.propriete,
            'gestion' : self.gestion,
            'equipement' : self.equipement,
            'long' : self.long,
            'lat' : self.lat,
            'x' : self.x,
            'y' : self.y,
            'adresse' : self.adresse,            
        } 

        
    insert_schema = {
    'type' : 'piscine',
    'required' : ['nom','type', 'arrondissement','adresse','propriete','gestion','equipement','long','lat','x','y'],
    'properties' : {
        'nom' : {
        'type': 'string'
        },
        'type' : {
        'type': 'string'
        },
        'arrondissement': {
        'type': 'string'
        },
        'adresse' : {
        'type': 'string'
        },
        'propriete' : {
        'type': 'string'
        },
        'gestion' : {
        'type': 'string'
        },
        'equipement' : {
        'type': 'string'
        },
        'long' : {
        'type': 'number'
        },
        'lat' : {
        'type': 'number'
        },
        'x' : {
        'type': 'number'
        },
        'y' : {
        'type': 'number'
        }
    },
    'additionalProperties': False
    }    