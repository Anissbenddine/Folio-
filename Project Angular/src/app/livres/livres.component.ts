import { Component, Input, OnInit, Output } from '@angular/core';
import { DataServiceService } from '../DataService.service';
import { CartService } from 'src/app/cart.service';
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
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.css']
})

export class LivresComponent implements OnInit {
  
  ListeLivres: Livre[] ;

  constructor(public data: DataServiceService,private cartService : CartService) { 
    this.ListeLivres = this.data.ListeLivres;
  }

  ngOnInit(): void {
  
  }
  addtocart(item: any){
    this.cartService.addtoCart(item);
  }
  

}
