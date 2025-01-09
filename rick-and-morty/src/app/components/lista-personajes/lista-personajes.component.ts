import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit {
  @Input() favoriteCharacter: any;
  @Output() favoriteSelected = new EventEmitter<any>();
  @Output() characterSelected = new EventEmitter<any>();

  row: any;
  characters: any[] = [];
  episodes: any[] = [];
  locations: any[] = [];
  filteredCharacters: any[] = [];
  filteredEpisodes: any[] = [];
  filteredLocations: any[] = [];
  displayedColumns: string[] = ['name', 'status', 'species', 'gender', 'type', 'created', 'detalle', 'favorito'];

  constructor(private rickAndMortyService: RickAndMortyService,
    private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getCharacters().subscribe((response: any) => {
      this.characters = response.results;
      this.filteredCharacters = response.results;
    });
  }

  esFavorito(character: any): boolean {
    return this.favoriteCharacter && this.favoriteCharacter.id === character.id;
  }

  marcarFavorito(character: any) {
    console.log('Personaje marcado como favorito:', character);
    this.favoriteCharacter = character;
    this.favoriteSelected.emit(character);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCharacters = this.characters.filter((character) =>
      character.name.toLowerCase().includes(filterValue)
    );
  }

  verDetalles(character: any) {
    console.log('Personaje seleccionado en lista:', character);
    this.characterSelected.emit(character);
  }
}
