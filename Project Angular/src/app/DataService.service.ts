import { Injectable } from '@angular/core';
import livres from 'src/assets/data/livres.json'
interface Livre {
  titre:string ,
  cpr:number,
  auteur:string
  prix:number,
  rabais:number,
  description:string,
  image:string 
  niveau:string
}
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

constructor() { }
ListeLivres:Livre[] = livres;

}

