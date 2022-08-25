**Liste des fonctionalités implementées (Total : 100 Pts):** 

- **A1**: La fonctionnalité est implémentée avec succès, la méthode qui s’occupe de l’injection est la méthode init() dans le fichier app.py, pour tester ce point vous pouvez aller sur la page d’accueil du projet sur la route ‘’/’’ on y voit plusieurs listes déroulantes des diverses installations, ou alors sur le terminal sqlite3, on peut faire un SELECT \* FROM et choisir les différentes tables :
  - Arrondissement : elle contient la liste de tous les arrondissements
  - Piscines : contient la liste de toutes les piscines 
  - Glissades : contient la liste de toutes les glissades
  - Patinoires : contient la liste de toutes les patinoires

- **A2** : La fonctionnalité est implémentée avec succès, a la ligne 182 du fichier app.py nous trouvons une condition qui vérifie si la base de donne est vide, si celle-ci est vide on fait les injections de toutes les données, dans le cas contraire on rentre dans le else a la ligne 187 du fichier app.py dans ce cas le scheduler se charge d’appeler la fonction update() qui se charge de mettre a jour la base de donnée et de mettre à jour également la variable des nouvelles   installations également. (elle envoie aussi le courriel et le tweet), pour tester vous pouvez modifier les valeur horaire de la fonction du scheduler a la ligne 188 du fichier app.py, en les mettant par exemple a la minute suivante de votre heure actuelle, essayez également de mettre un print() dans la fonction update pour voir que quand l’heure indiquée sera venue votre print s’affiche

- **A3** : La fonctionnalité est implémentée avec succès, on peut vérifier cela en visitant la route ‘’/doc ‘’, au niveau de la fonction update qui s’occupe des mises a jour quotidienne on remarque la fonction « os.systeme » a la ligne 163 du fichier app.py, cette dernière s’occupera de convertir le fichier doc.raml en fichier doc.html, et ceci se fait automatiquement chaque jour à minuit , vous pouvez tester ce point en modifiant le fichier raml et en testant de la même manière qu’au point A2

- **A4** : La fonctionnalité est implémentée avec succès, pour la tester il suffit de se rentre sur la route ‘’/’’ et de choisir l’arrondissement dans le menu déroulant puis de cliquer sur le bouton « chercher les installations », Cette fonction est implement par la route @app.route("/api/installations", methods=['GET']), a la ligne 224 du fichier app.py
- **A5** : La fonctionnalité est implémentée avec succès, on peut tester cette fonction de la même manière qu’on teste la fonction A4

- **A6** : La fonctionnalité est implémentée avec succès, pour la tester il suffit de se rentre sur la route ‘’/’’ et de choisir l’installation dans le menu déroulant puis de cliquer sur le bouton « Afficher Informations », le service REST qui s’occupe de cette fonctionalite se trouve a la route @app.route("/api/info-installations", methods=['GET'])


- **B1** : La fonctionnalité est implémentée avec succès, un compte gmail a été cree spécialement pour le projet ses logs sont :
  - **Login** : <projectsessioninf5190@gmail.com>
  - **Password** : inf\_5190

Pour tester la fonctionnalité vous pouvez ajouter de nouvelles installations et changez l’adresse mail destinataire a la ligne 27 du fichier app.py, (c’est mon adresse personelle qui y est inscrite pour les besoins des tests ) l’adresse est également stockee dans le fichier config.yaml

- **B2** : La fonctionnalité est implémentée avec succès, un compte twitter a été cree pour l’occasion, les logs de ce compte sont :
  - **Login** : New\_Instal
  - **Password** : inf\_5190

Le tweet s’envoi avec la fonction create\_tweet a la ligne 177 du fichier app.py, vous pouvez tester la fonctionnalité, en sortant cette ligne de la fonction update(), Et en changeant la variable text par du texte aléatoire, vous verrez alors votre text en tweet sur le profil mentionne auparavant 

- **C1** : La fonctionnalité est implémentée avec succès, pour la tester il suffit de se rentre sur la route ‘’/’’ et de choisir le type d’installations dans le menu déroulant puis de cliquer sur le bouton « Afficher les installations », le service REST qui s’occupe de cette fonctionalite se trouve a la route @app.route("/api/type-installations", methods=['GET'])

- **C2** : La fonctionnalité est implémentée avec succès, pour la tester il suffit de se rendre sur la route ‘’/’’ et de choisir le type d’installations dans le menu déroulant puis de cliquer sur le bouton « XML »


- **C2** : La fonctionnalité est implémentée avec succès, pour la tester il suffit de se rendre sur la route ‘’/’’ et de choisir le type d’installations dans le menu déroulant puis de cliquer sur le bouton « CSV »

