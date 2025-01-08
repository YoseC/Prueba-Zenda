import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { ListaPersonajesComponent } from './components/lista-personajes/lista-personajes.component';
import { DetallesPersonajesComponent } from './components/detalles-personajes/detalles-personajes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FavoritosComponent,
    ListaPersonajesComponent,
    DetallesPersonajesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
