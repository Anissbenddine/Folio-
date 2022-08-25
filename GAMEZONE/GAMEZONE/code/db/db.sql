create table User (
  id integer primary key,
  email varchar(20),
  motpasse varchar(20),
  firstname varchar(100),
  lastname varchar(100),
  date_naissance text,
  gendre varchar(20),
  phone varchar(20),
  langue varchar(20),
  gameone varchar(100),
  gametwo varchar(100),
  gamethree varchar(100),
  timeone varchar(100),
  timetwo varchar(100),
  timethree varchar(100),
  imgname text
  
);

create table friends(
  current varchar(20), 
  friend varchar(20), 
  etat varchar(20) 
);

create table profil(
  followers integer,
  friends integer,
  photos integer
);

create table post(
  id integer primary key,
  id_count integer,
  contenu text,
  pic_name text,
  id_current  integer,
  post_date text,
  firstname text,
  lastname text,
  pictureUser text,
  FOREIGN KEY (id_current) REFERENCES User(id)
);

create table comment(
  contenu text,
  id_current_post  integer,
  email_current_user text,
  comment_date text,
  firstname text,
  lastname text,
  picture text,
  FOREIGN KEY (id_current_post) REFERENCES post(id)
);