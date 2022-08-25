import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from '../DataService.service';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Liste: Livre[] = [];
  constructor(public data: DataServiceService,private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if (params['searchTerm']){
        console.log(params['searchTerm']);
        this.Liste = this.data.ListeLivres.filter(livre => livre.titre.toLowerCase().includes(params['searchTerm'].toLowerCase()))
      }else{
        this.Liste=this.data.ListeLivres;
      }
     
    })
  }

}
