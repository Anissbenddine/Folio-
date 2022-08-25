import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/DataService.service';
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
@Component({
  selector: 'app-moicesttantale',
  templateUrl: './moicesttantale.component.html',
  styleUrls: ['./moicesttantale.component.css']
})
export class MoicesttantaleComponent implements OnInit {

  ListeLivres: Livre[];
  constructor(public data:DataServiceService) {
    this.ListeLivres = this.data.ListeLivres;
   }

  ngOnInit(): void {
  }

}
