import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FavoritosService } from '../../services/favoritos.service';
import { FavoritoDialogComponent } from '../../favorito-dialog/favorito-dialog.component';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';

@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ],
  imports: [
    MatToolbar,
    NgIf
  ]
})
export class HeaderComponent implements OnInit {
  @Input() favoriteCharacter: any;
  favorito: any = null;

  constructor(private favoritosService: FavoritosService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.favoritosService.favorito$.subscribe((personaje) => {
      this.favorito = personaje; // Actualiza el favorito cuando cambia
    });
  }

  mostrarInfoFavorito(): void {
    if (this.favorito) {
      this.dialog.open(FavoritoDialogComponent, {
        data: this.favorito
      });
    }
  }
}
