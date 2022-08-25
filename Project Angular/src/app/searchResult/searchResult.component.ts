import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
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
  selector: 'app-searchResult',
  templateUrl: './searchResult.component.html',
  styleUrls: ['./searchResult.component.css']
})
export class SearchResultComponent implements OnInit {
  Liste: Livre[] = [];
  constructor(public data: DataServiceService,private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if (params['searchTerm']){
        this.data.ListeLivres.forEach(livre => {
        if(livre.titre.toLowerCase().includes(params['searchTerm'].toLowerCase())){
          this.Liste[0] = livre;
        }
      });
      }else{
        this.Liste=this.data.ListeLivres;
      }
     
    })
  }

}
