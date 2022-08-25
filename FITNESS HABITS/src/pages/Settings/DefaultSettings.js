import uuid from "react-uuid";
    
const DefaultSettings = {
    "hydrates" :
    [
        {id: uuid(), favoris: false, name:"Eau", qtte:250, proteine:0, glucide:0, fibre:0, gras:0, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Thé", qtte:250, proteine:0, glucide:0, fibre:0, gras:0, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Café noir", qtte:250, proteine:0, glucide:0, fibre:0, gras:0, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Tisane", qtte:250, proteine:0, glucide:0, fibre:0, gras:0, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Jus d'orange", qtte:250, proteine:1.8, glucide:25.5, fibre:0.5, gras:0.5, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Jus de pomme", qtte:250, proteine:0.2, glucide:28, fibre:0.2, gras:0.2, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Eau pétillante ", qtte:250, proteine:0, glucide:0, fibre:0, gras:0,  unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Jus d'ananas", qtte:250, proteine:0.9, glucide:40, fibre:3.3, gras:0.3, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Cola-Soda sucré", qtte:12, proteine:0, glucide:39, fibre:0, gras:0, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Soda diète", qtte:12, proteine:0, glucide:0, fibre:0, gras:0, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Lait entier 3,25% ", qtte:250, proteine:7.9, glucide:12.8, fibre:0, gras:7.9, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Lait 2%", qtte:250, proteine:8.1, glucide:12.3, fibre:0, gras:4.8, ml:true, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Lait 1%", qtte:250, proteine:12, glucide:9, fibre:0, gras:2.5, ml:true, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Lait écrémé", qtte:250, proteine:9, glucide:13, fibre:0, gras:0, ml:true, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Lait d'amandes", qtte:250, proteine:1, glucide:1, fibre:1, gras:2.5, unit:"ml", consumption:0},
    ],

    "alcools" :
    [
        {id: uuid(), favoris: false, name:"Vin rouge", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Vin blanc", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Bière", qtte:1,  proteine:0, fibre:0, gras:0, glucide:1.1, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Cidre", qtte:10,  proteine:0, fibre:0, gras:0, glucide:0.3, unit: "ml", consumption:0},
        {id: uuid(), favoris: false, name:"Whisky", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Rhum", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0, unit: "oz", consumption:0},
    ],

    "proteines" : 
    [
        {id: uuid(), favoris: false, name:"Boeuf", qtte:100, proteine:26, glucide:28, fibre:0, gras:15, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Poulet-poitrine", qtte:100, proteine:31, glucide:0, fibre:0, gras:3.6,  unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Poulet-cuisse", qtte:100, proteine:26, glucide:0, fibre:0, gras:19.2, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Dinde-poitrine", qtte:100, proteine:26, glucide:0, fibre:0, gras:1, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Dinde-cuisse", qtte:100, proteine:28.5, glucide:0, fibre:0, gras:5.4, unit: "oz", consumption:0},
        {id: uuid(), favoris: false, name:"Porc", qtte:100, proteine:27, glucide:0, fibre:0, gras:14, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Jambon", qtte:100, proteine:8.1, glucide:0, fibre:0, gras:1.5, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Veau", qtte:100, proteine:21, glucide:0, fibre:0, gras:8, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Lapin", qtte:100, proteine:24, glucide:13, fibre:0, gras:3.5, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Cheval", qtte:100, proteine:28, glucide:0, fibre:0, gras:6, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Oeuf", qtte:1, proteine:6, glucide:1, fibre:0, gras:5, unit: "unite", consumption:0},
        {id: uuid(), favoris: false, name:"Poisson blanc", qtte:100, proteine:19, glucide:0, fibre:0, gras:1, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Saumon-truite", qtte:100, proteine:24, glucide:0, fibre:0, gras:8, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Crevettes", qtte:100, proteine:24, glucide:0.2, fibre:0, gras:0.3, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Homard", qtte:100, proteine:28, glucide:3.4, fibre:0, gras:2, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Crabe", qtte:100, proteine:19, glucide:0, fibre:0, gras:1.5, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Huître", qtte:6, proteine:16, glucide:0, fibre:0, gras:4, unit: "gr", consumption:0},
        {id: uuid(), favoris: false, name:"Gibier", qtte:100, proteine:16, glucide:0, fibre:0, gras:1, unit: "gr", consumption:0},
    ],

    "gras" :
    [
        {idGras: uuid(), favoris: false, name:"Beurre", qtte:15, proteine:0.12, glucide:0.01, fibre:0, gras:11.52, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Huile d'olive", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Graisse de coco", qtte:15, proteine:0, glucide:0, fibre:0, gras:13.5, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"ghee", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Huile", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Crème 35%", qtte:15, proteine:0.4, glucide:0.56, fibre:0, gras:5, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Crème 15%", qtte:15, proteine:0.4, glucide:0.56, fibre:0, gras:2.9, unit: "gr", consumption:0},
        {idGras: uuid(), favoris: false, name:"Mayonnaise", qtte:14, proteine:0, glucide:0, fibre:0, gras:11, unit: "gr", consumption:0},
    ],
    
    "legumes" : 
    [
        {idLegumes: uuid(), favoris: false, name:"Chou vert", qtte:1, proteine:1.1, glucide:5.2, fibre:2.2, gras:0.09, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Chou rouge", qtte:1, proteine:1.3, glucide:6.6, fibre:1.9, gras:0.14, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Choux Bruxelles", qtte:1, proteine:3, glucide:7.9, fibre:3.3, gras:0.26, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Carottes crues", qtte:1, proteine:1, glucide:10.5, fibre:3.1, gras:0.26, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Carottes cuites", qtte:0.5, proteine:0.6, glucide:6.4, fibre:2.3, gras:0.14, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Aubergine grillée", qtte:100, proteine:0.9, glucide:6.36, fibre:0.9, gras:8.18, unit: "gr", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Laitue", qtte:1, proteine:0.31, glucide:1.04, fibre:0.42, gras:0.05, unit: "tasse", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Tomates crues", qtte:100, proteine:0.9, glucide:3.9, fibre:1.2, gras:0.2, unit: "gr", consumption:0},
        {idLegumes: uuid(), favoris: false, name:"Broccoli cuit", qtte:0.5, proteine:1.9, glucide:5.6, fibre:2.6, gras:0.32, unit: "tasse", consumption:0},
    ],

    "cereales" : 
    [
        {idCereales: uuid(), favoris: false, name:"Pain", qtte:15, proteine:0.12, glucide:0.01, fibre:0, gras:11.52, unit: "gr", consumption:0},
        {idCereales: uuid(), favoris: false, name:"Biscottes", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idCereales: uuid(), favoris: false, name:"Viennoiserie", qtte:15, proteine:0, glucide:0, fibre:0, gras:13.5, unit: "gr", consumption:0},
        {idCereales: uuid(), favoris: false, name:"Riz", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idCereales: uuid(), favoris: false, name:"Céréales", qtte:15, proteine:0, glucide:0, fibre:0, gras:15, unit: "gr", consumption:0},
        {idCereales: uuid(), favoris: false, name:"Pâtes alimentaires", qtte:15, proteine:0.4, glucide:0.56, fibre:0, gras:5, unit: "gr", consumption:0},
    ],

    "supps" : 
    [
        { idSupp: uuid(), favoris: false, name:"Vitamine B12", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: "oz", consumption:0},
        { idSupp: uuid(), favoris: false, name:"Vitamine D", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: "oz", consumption:0},
        { idSupp: uuid(), favoris: false, name:"Vitamine C", qtte:1,  proteine:0, fibre:0, gras:0, glucide:1.1, unit: "oz", consumption:0},
        { idSupp: uuid(), favoris: false, name:"Calcium", qtte:10,  proteine:0, fibre:0, gras:0, glucide:0.3, unit: "ml", consumption:0},
        { idSupp: uuid(), favoris: false, name:"Acide folique", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0, unit: "oz", consumption:0},
    ]
}
export default DefaultSettings
