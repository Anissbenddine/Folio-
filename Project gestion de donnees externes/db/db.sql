create table arrondissement (
    _idArr integer primary key,
    nom text 
);

create table piscines(
    _idPi integer primary key,
    nom varchar(100),
    _idarrondissement_pi integer,
    type_piscine varchar(100),
    adresse varchar(100),
    propriete varchar(100),
    gestion varchar(100),
    point_X DECIMAL,
    point_Y DECIMAL,
    equipement varchar(100),
    long DECIMAL,
    lat DECIMAL,
    type_install varchar(40),
    FOREIGN KEY (_idarrondissement_pi) REFERENCES arrondissement(_idArr)
);

create table patinoires(
    _idPat integer primary key,
    nom varchar(100),
    _idarrondissement_pat integer,
    ouvert integer,
    deblaye integer,
    resurface integer,
    arrose integer,
    date_maj date,
    type_install varchar(40),
    FOREIGN KEY (_idarrondissement_pat) REFERENCES arrondissement(_idArr)
);

create table airesJeux(
    _idAire integer primary key,
    nom varchar(100),
    _idarrondissement_air integer,
    ouvert integer,
    deblaye integer,
    condition varchar(15),
    date_maj date,
    type_install varchar(40),
    FOREIGN KEY (_idarrondissement_air) REFERENCES arrondissement(_idArr)
);