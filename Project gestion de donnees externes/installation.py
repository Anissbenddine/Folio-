#Classe qui represente une installation dans un format plus general
# elle ne possede qu'un nom et un arrondissement
# format plus leger pour les petites requetes 

class Installation:
    def __init__(self, nom, arrondissement):

        self.nom = nom
        self.arrondissement = arrondissement


    def all_info(self):
        return {
            'nom' : self.nom,
            'arrondissement' : self.arrondissement,
        }    

    insert_schema = {
    'type' : 'object',
    'required' : ['nom', 'arrondissement'],
    'properties' : {
        'nom' : {
        'type': 'string'
        },
        'arrondissement': {
        'type': 'string'
        }
    },
    'additionalProperties': False
    }    