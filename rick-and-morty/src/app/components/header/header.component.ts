import { Component, OnInit, Input } from '@angular/core';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() favoriteCharacter: any;
  favorito: any = null;

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.favoritosService.favorito$.subscribe((personaje) => {
      this.favorito = personaje; // Actualiza el favorito cuando cambia
    });
  }
}
