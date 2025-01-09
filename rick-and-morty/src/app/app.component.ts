import { Component, Input } from '@angular/core';
import { FavoritosService } from './services/favoritos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
