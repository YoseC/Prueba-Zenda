import { Component, Input } from '@angular/core';
import { FavoritosService } from './services/favoritos.service';
import { HeaderComponent } from './components/header/header.component';
import { ListaPersonajesComponent } from './components/lista-personajes/lista-personajes.component';
import { DetallesPersonajesComponent } from './components/detalles-personajes/detalles-personajes.component';
import { NgIf } from '@angular/common';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    ListaPersonajesComponent,
    DetallesPersonajesComponent,
    NgIf
  ],
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  @Input() favoriteCharacter: any;
  selectedCharacter: any;

  constructor(private favoritosService: FavoritosService) {}

  onFavoriteSelected(character: any): void {
    this.favoriteCharacter = character;
    this.favoritosService.setFavorito(character);
  }

  verDetalles(character: any) {
    this.selectedCharacter = character;
  }

  mostrarDetallesFavorito(character: any): void {
    console.log('Detalles del favorito:', character);
  }

}
