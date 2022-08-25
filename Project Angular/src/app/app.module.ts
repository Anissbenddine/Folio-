import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LivresComponent } from './livres/livres.component';
import { CategoriesComponent } from './categories/categories.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { panierComponent } from './panier/panier.component';
import { RomanComponent } from './categories/roman/roman.component';
import { PoesieComponent } from './categories/poesie/poesie.component';
import { DictionnaireComponent } from './categories/dictionnaire/dictionnaire.component';
import { DocumentaireComponent } from './categories/documentaire/documentaire.component';
import { HttpClientModule } from '@angular/common/http';
import { CestquoilamourComponent } from './livres/cestquoilamour/cestquoilamour.component';
import { MoicesttantaleComponent } from './livres/moicesttantale/moicesttantale.component';
import { PourquoilesfillesComponent } from './livres/pourquoilesfilles/pourquoilesfilles.component';
import { SijedisparaisComponent } from './livres/sijedisparais/sijedisparais.component'
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './searchResult/searchResult.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LivresComponent,
    CategoriesComponent,
    NavbarComponent,
    ProfileComponent,
    panierComponent,
    RomanComponent,
    PoesieComponent,
    DictionnaireComponent,
    DocumentaireComponent,
    CestquoilamourComponent,
    MoicesttantaleComponent,
    PourquoilesfillesComponent,
    SijedisparaisComponent,
    SearchComponent,
    SearchResultComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'', component: HomeComponent},
      {path:'Catalogue', component: LivresComponent},
      {path: 'Categories', component: CategoriesComponent},
      {path:'Panier', component: panierComponent},
      {path:'Profile', component: ProfileComponent},
      {path:'roman',component:RomanComponent},
      {path:'poesie',component:PoesieComponent},
      {path:'dictionnaire',component:DictionnaireComponent},
      {path:'documentaire',component:DocumentaireComponent},
      {path:'cestquoilamour', component:CestquoilamourComponent},
      {path:'moicesttantale',component:MoicesttantaleComponent},
      {path:'pourquoilesfilles',component:PourquoilesfillesComponent},
      {path:'sijedisparais',component:SijedisparaisComponent},
      {path:'search/:searchTerm',component:SearchResultComponent},
      {path: '**', component:HomeComponent}
    ]

    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
