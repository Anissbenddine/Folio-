npm # Welcome to the FinessHabits project / Bienvenue au projet FitnessHabits

#### 1- Cloner le projet fitnesshabits:  
```
   git clone https://gitlab.info.uqam.ca/trudel_syl/fitnesshabits.git fithab
```

#### 2- Entrer dans le répertoire `fithab`

#### 3- Entrer les commandes:
```
   $ npm install
   $ npm run build  
```

#### 3.1- Tester sur le navigateur:
```
   $ npm run start

   Utiliser le format appareil mobile offert par le navigateur pour un meilleur affichage
```
![alt text](/public/assets/exemple.png)


#### 4- Créer les dossiers `ios` et `android` avec:
```
   $ npx cap add android 
   $ npx cap add ios      
```

#### 4.1- Pour Android:
```
   1- Supprimer le fichier 'fithab/android/app/src/main'. 
   2- Ajouter le fichier 'fithab/main', dans 'fithab/android/app/src'.  
   3- Entrer 'npx cap open android' pour ouvrir Android Studio
   4- Compiler le code et tester dans un simulateur.  
```

#### 4.2- Pour iOS:
```
   1- Supprimer le fichier 'fithab/ios/App/App'.  
   2- Ajouter le fichier 'fithab/App', dans 'fithab/ios/App'.  
   3- Ouvrire xcode avec 'npx cap open ios'.  

   4. Dans Xcode:
      1- Supprimer le fichier 'App/App/LaunchScreen.storyboard'.
      2- Faire un drag and drop du fichier 'fithab/ios/App/App/LaunchScreen.storyboard' dans le dossier 'App/App' dans Xcode.
      3- Un pop-up apparaît, cliquer sur 'finish' pour accepter le changement.  
      4- Compiler le code et tester dans un simulateur.  
```





