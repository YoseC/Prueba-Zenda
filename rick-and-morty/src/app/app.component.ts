import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritosService } from './services/favoritos.service';
import { HeaderComponent } from './components/header/header.component';
import { ListaPersonajesComponent } from './components/lista-personajes/lista-personajes.component';
import { DetallesPersonajesComponent } from './components/detalles-personajes/detalles-personajes.component';
import { NgIf } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FavoritoDialogComponent } from './favorito-dialog/favorito-dialog.component';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    DashboardComponent,
    FavoritoDialogComponent,
    ListaPersonajesComponent,
    DetallesPersonajesComponent,
    NgIf,
    RouterModule,
  ],
  standalone: true,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  @Input() favoriteCharacter: any;
  selectedCharacter: any;

  constructor(private favoritosService: FavoritosService,private router: Router  ) {}

  onFavoriteSelected(character: any): void {
    this.favoriteCharacter = character;
    this.favoritosService.setFavorito(character);
  }

  verDetalles(character: any) {
    this.selectedCharacter = character;
    this.router.navigate(['/detalles-personajes', character.id]);
  }

  mostrarDetallesFavorito(character: any): void {
    console.log('Detalles del favorito:', character);
  }

}
