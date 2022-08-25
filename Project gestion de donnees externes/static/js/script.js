//******************************************************************************************//
// ----------------- FONCTIONS JAVASCRIPT (REQUETES ASYNCRONES - PARSERS ) ---------------- // 
//******************************************************************************************//


/**
 * Fonction qui permets d'attendre une reponse d'un service REST
 * pour afficher une liste d'installations selon l'arrondissement choisi par
 * l'utilisateur
 */
function asyncrone_get_install_by_arr(){
    var selected_arr = document.getElementById("arrondissement_choisi").value;
    var xmlhttp = new XMLHttpRequest();
    var url = '/api/installations?arrondissement='+selected_arr; 
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            get_install_arr(myArr);
        }else {
            document.getElementById("content").innerHTML ='<img src="/images/loading.gif" alt="">';    
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


/**
 * Fonction qui permets d'attendre une reponse d'un service REST
 * pour afficher une liste d'installations selon le type d'installations choisi par
 * l'utilisateur
 */
function asyncrone_get_all_install(){
    var selected_type = document.getElementById("type_choisi").value;
    var xmlhttp = new XMLHttpRequest();
    var url = '/api/type-installations?type_install='+selected_type;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            if(selected_type == 'piscines'){
                get_all_piscine(myArr)
            }else if (selected_type == 'glissades'){
                get_all_glissade(myArr)
            }else
                get_all_patinoire(myArr)
        }else {
            document.getElementById("content").innerHTML ='<img src="/images/loading.gif" alt="">';    
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Fonction qui permets d'attendre une reponse d'un service REST
 * pour afficher generer un fichier XML des installations choisies par leur
 * type
 */
function asyncrone_get_XML(){
    var selected_type = document.getElementById("type_choisi").value;
    var xmlhttp = new XMLHttpRequest();
    var url = '/api/type-installations?type_install='+selected_type;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            var data = OBJtoXML(myArr,selected_type)
            downloadToFile(data, 'intsalations.xml', 'text/plain');
        };

    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Fonction qui permets d'attendre une reponse d'un service REST
 * pour afficher generer un fichier CSV des installations choisies par leur
 * type
 */
 function asyncrone_get_CSV(){
    var selected_type = document.getElementById("type_choisi").value;
    var xmlhttp = new XMLHttpRequest();
    var url = '/api/type-installations?type_install='+selected_type;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            csv = ConvertToCSV(myArr,selected_type)
            downloadToFile(csv, 'intsalations.csv', 'text/plain');         
        };
            
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Fonction qui permets d'attendre une reponse d'un service REST
 * pour afficher une liste d'informations concernant'installations choisi par
 * l'utilisateur
 */
function asyncrone_get_info_install(){
    var selected_install = document.getElementById("installation_choisi").value;
    var xmlhttp = new XMLHttpRequest();
    var url = '/api/info-installations?installation='+selected_install;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            if(myArr.type == 'piscine'){
                get_info_install_piscine(myArr)
            }else if (myArr.type == 'glissade'){
                get_info_install_glissade(myArr)
            }else
                get_info_install_patinoire(myArr)
        }else {
            document.getElementById("content").innerHTML ='<img src="/images/loading.gif" alt="">';    
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


/**
 * Fonction qui transforme un object en fichier XML elle prend 2 parametres
 * @param {L'object a transformer en XML} obj 
 * @param {*Le type d'installations} type 
 * @returns un fichier xml duement formatte
 */
function OBJtoXML(obj,type) {
    var xml = '';
    xml += "<" +type + ">"
    for (var item in obj) {
        xml += obj[item] instanceof Array ? '' : "<" + item + ">";
        if (obj[item] instanceof Array) {
        for (var array in obj[item]) {
            xml += "<" + item + ">";
            xml += OBJtoXML(new Object(obj[item][array]));
            xml += "</" + item + ">";
        }
        } else if (typeof obj[item] == "object") {
        xml += OBJtoXML(new Object(obj[item]));
        } else {
        xml += obj[item];
        }
        xml += obj[item] instanceof Array ? '' : "</" + item + ">";
    }
    xml += "</" +type + ">"
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    var xml = xml.replace("undefined","installation")
    var xml = xml.replace("/undefined","/installation")
    return xml
}

/**
 * Fonction qui soumet a l'utilisateur le telechargement d'un fichier
 * @param {*le contenu du fichier} content 
 * @param {* le nom du fichier} filename 
 * @param {* le type de donnee contenue dans le fichier} contenu
 */
const downloadToFile = (content, filename, contenu) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contenu});
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};
          
/**
 * Fonction qui transforme un object en fichier CSV elle prend 2 parametres
 * @param {*l'object a transformer} variable 
 * @param {*le type d'installation} type 
 * @returns un fichier CSV duement formatte
 */
function ConvertToCSV(variable,type) {
    var str_piscine = "adresse,arrondissement,equipement,gestion,id,lat,long,nom,propriete,type,x,y\r\n"   
    var str_glissade = "arrondissement,condition,deblaye,id,nom,ouvert,type\r\n"
    var str_patinoire = "arrondissement,arrose,deblaye,id,nom,ouvert,resurface,type\r\n"
    var ligne = '';
    if(type == 'piscines'){
        ligne+=str_piscine;
    }else if (type == 'glissades'){
        ligne+=str_glissade ;
    }else{
        ligne+=str_patinoire;
    }
    var tabbleau = typeof variable != 'object' ? JSON.parse(variable) : variable;
    for (var i = 0; i < tabbleau.length; i++) {
        var line = '';
        for (var j in tabbleau[i]) {
            if (line != '') line += ','
            line += tabbleau[i][j];
        }
        ligne += line + '\r\n';
    }
    return ligne;
}
          



//******************************************************************************************//
// ------------------------------ FONCTIONS D'AFFICHAGE HTML ------------------------------ // 
//******************************************************************************************//


/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_install_by_arr()
 */
 function get_install_arr(data){
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    
    html += '</tr>'
    for (var i = 0 ; i < data.length; i++ )   {
        html += '<tr>';
        html += '<td>' + data[i].nom + '</td>';
        html += '<td>' + data[i].arrondissement + '</td>';
        html += '</tr>';
    }     
    document.getElementById("content").innerHTML = html;       
} 

/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_info_install()
 * dans le cas ou l'installation est une piscine
 */
function get_info_install_piscine(data){
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Type</th>'
    html += '<th scope="col">Adresse </th>'
    html += '<th scope="col">Propriete</th>'
    html += '<th scope="col">Gestion</th>'
    html += '<th scope="col">Equipement</th>'
    html += '<th scope="col">Long </th>'
    html += '<th scope="col">Lat</th>'
    html += '<th scope="col">Point - X </th>'
    html += '<th scope="col">Point - Y </th>'                
    html += '</tr>'
        html += '<tr>';
        html += '<td>' + data.nom + '</td>';
        html += '<td>' + data.arrondissement + '</td>';
        html += '<td>' + data.type + '</td>';
        html += '<td>' + data.adresse + '</td>';
        html += '<td>' + data.propriete + '</td>';
        html += '<td>' + data.gestion + '</td>';
        html += '<td>' + data.equipement + '</td>';
        html += '<td>' + data.long + '</td>';
        html += '<td>' + data.lat + '</td>';
        html += '<td>' + data.x + '</td>';
        html += '<td>' + data.y + '</td>';
        html += '</tr>';   
    document.getElementById("content").innerHTML = html;       
} 

/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_info_install()
 * dans le cas ou l'installation est une glissade
 */
function get_info_install_glissade(data){
    ouvert=''
    deblaye = ''
    if(data.ouvert == 1)
        ouvert = "Oui"
    else
        ouvert = "Non"        
    if(data.deblaye == 1)
        deblaye = "Oui"
    else
        deblaye = "Non" 
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Type </th>'
    html += '<th scope="col">Ouvert</th>'
    html += '<th scope="col">Deblaye </th>'
    html += '<th scope="col">Condition</th>' 
    html += '<th scope="col">Date mise a jour</th>'         
    html += '</tr>'
    html += '<tr>';
    html += '<td>' + data.nom + '</td>';
    html += '<td>' + data.arrondissement + '</td>';
    html += '<td>' + data.type + '</td>';
    html += '<td>' + ouvert + '</td>';
    html += '<td>' + deblaye + '</td>';
    html += '<td>' + data.condition + '</td>';
    html += '<td>' + data.date_maj + '</td>';
    html += '</tr>';
        
    document.getElementById("content").innerHTML = html;       
} 

/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_info_install()
 * dans le cas ou l'installation est une patinoire
 */
function get_info_install_patinoire(data){
    ouver = ''
    deblaye = ''
    arrose = ''
    resurface = ''
    if(data.ouvert == 1)
        ouvert = "Oui"
    else
        ouvert = "Non"        
    if(data.deblaye == 1)
        deblaye = "Oui"
    else
        deblaye = "Non"
    if(data.arrose == 1)
        arrose = "Oui"
    else
        arrose = "Non"        
    if(data.resurface == 1)
        resurface = "Oui"
    else
        resurface = "Non"    
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Ouvert</th>'
    html += '<th scope="col">Deblaye </th>'
    html += '<th scope="col">Arrosee</th>'     
    html += '<th scope="col">Resurface</th>'  
    html += '<th scope="col">Date mise a jour</th>'                      
    html += '</tr>'
    html += '<tr>';
    html += '<td>' + data.nom + '</td>';
    html += '<td>' + data.arrondissement + '</td>';
    html += '<td>' + ouvert + '</td>';
    html += '<td>' + deblaye + '</td>';
    html += '<td>' + arrose + '</td>';
    html += '<td>' + resurface + '</td>';
    html += '<td>' + data.date_maj + '</td>';
    html += '</tr>';
        
    document.getElementById("content").innerHTML = html;       
} 





/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_all_install()
 * dans le cas ou l'installation est une piscine
 */
function get_all_piscine(data){
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Type</th>'
    html += '<th scope="col">Adresse </th>'
    html += '<th scope="col">Propriete</th>'
    html += '<th scope="col">Gestion</th>'
    html += '<th scope="col">Equipement</th>'
    html += '<th scope="col">Long </th>'
    html += '<th scope="col">Lat</th>'
    html += '<th scope="col">Point - X </th>'
    html += '<th scope="col">Point - Y </th>'                
    html += '</tr>'
    for (var i = 0 ; i < data.length; i++ )   {
        html += '<tr>';
        html += '<td>' + data[i].nom + '</td>';
        html += '<td>' + data[i].arrondissement + '</td>';
        html += '<td>' + data[i].type + '</td>';
        html += '<td>' + data[i].adresse + '</td>';
        html += '<td>' + data[i].propriete + '</td>';
        html += '<td>' + data[i].gestion + '</td>';
        html += '<td>' + data[i].equipement + '</td>';
        html += '<td>' + data[i].long + '</td>';
        html += '<td>' + data[i].lat + '</td>';
        html += '<td>' + data[i].x + '</td>';
        html += '<td>' + data[i].y + '</td>';
        html += '</tr>';   
    }
    document.getElementById("content").innerHTML = html;       
} 

/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_all_install()
 * dans le cas ou l'installation est une glissade
 */
function get_all_glissade(data){
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Type </th>'
    html += '<th scope="col">Ouvert</th>'
    html += '<th scope="col">Deblaye </th>'
    html += '<th scope="col">Condition</th>'
    html += '<th scope="col">Date mise a jour</th>'          
    html += '</tr>'
    html += '<tr>';
    for (var i = 0 ; i < data.length; i++ )   {
        ouvert=''
        deblaye = ''
        if(data[i].ouvert == 1)
            ouvert = "Oui"
        else
            ouvert = "Non"        
        if(data[i].deblaye == 1)
            deblaye = "Oui"
        else
            deblaye = "Non" 
            html += '<td>' + data[i].nom + '</td>';
            html += '<td>' + data[i].arrondissement + '</td>';
            html += '<td>' + data[i].type + '</td>';
            html += '<td>' + ouvert + '</td>';
            html += '<td>' + deblaye + '</td>';
            html += '<td>' + data[i].condition + '</td>';
            html += '<td>' + data[i].date_maj + '</td>';
            html += '</tr>';
    }    
    document.getElementById("content").innerHTML = html;       
} 

/**
 * Fonction qui gere l'affichage HTML de la fonction asyncrone_get_all_install()
 * dans le cas ou l'installation est une patinoire
 */
function get_all_patinoire(data){
    var html = " <table border = '1|1'>"
    html += '<tr>'
    html += '<th scope="col">Installation</th>'
    html += '<th scope="col">Arrondissement </th>'
    html += '<th scope="col">Ouvert</th>'
    html += '<th scope="col">Deblaye </th>'
    html += '<th scope="col">Arrosee</th>'     
    html += '<th scope="col">Resurface</th>'  
    html += '<th scope="col">Date mise a jour</th>'             
    html += '</tr>'
    html += '<tr>';
    for (var i = 0 ; i < data.length; i++ )   {
        ouver = ''
        deblaye = ''
        arrose = ''
        resurface = ''
        if(data[i].ouvert == 1)
            ouvert = "Oui"
        else
            ouvert = "Non"        
        if(data[i].deblaye == 1)
            deblaye = "Oui"
        else
            deblaye = "Non"
        if(data[i].arrose == 1)
            arrose = "Oui"
        else
            arrose = "Non"        
        if(data[i].resurface == 1)
            resurface = "Oui"
        else
            resurface = "Non"  
        html += '<td>' + data[i].nom + '</td>';
        html += '<td>' + data[i].arrondissement + '</td>';
        html += '<td>' + ouvert + '</td>';
        html += '<td>' + deblaye + '</td>';
        html += '<td>' + arrose + '</td>';
        html += '<td>' + resurface + '</td>';
        html += '<td>' + data[i].date_maj + '</td>';
        html += '</tr>';
    }
    document.getElementById("content").innerHTML = html;       
} 





