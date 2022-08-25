# Classe qui represente une glissade avec tous les champs disponibles dans le fichier XML fournis 


class Glissade:
    def __init__(self, id, nom,type, arrondissement,ouvert,deblaye,condition,date_maj):
        self.id = id
        self.nom = nom
        self.type=type
        self.arrondissement = arrondissement
        self.ouvert = ouvert
        self.deblaye = deblaye
        self.condition = condition
        self.date_maj = date_maj
        


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
            'type' : self.type,
            'arrondissement' : self.arrondissement,
            'ouvert' : self.ouvert,
            'deblaye' : self.deblaye,
            'condition' : self.condition,
            'date_maj':self.date_maj
            
        } 
    insert_schema = {
    'type' : 'object',
    'required' : ['nom', 'type','arrondissement','ouvert','deblaye','condition'],
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
        'ouvert' : {
        'type': 'number'
        },
        'deblaye' : {
        'type': 'number'
        },
        'condition' : {
        'type': 'number'
        },
        'date_maj' : {
        'type': 'string'
        }
    },
    'additionalProperties': False
    }    