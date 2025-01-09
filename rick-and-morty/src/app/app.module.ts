import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {  MatDialogModule } from '@angular/material/dialog';






import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';

import { ListaPersonajesComponent } from './components/lista-personajes/lista-personajes.component';
import { DetallesPersonajesComponent } from './components/detalles-personajes/detalles-personajes.component';
import { HttpClientModule } from '@angular/common/http';
import { FavoritoDialogComponent } from './favorito-dialog/favorito-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListaPersonajesComponent,
    DetallesPersonajesComponent,
    FavoritoDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
