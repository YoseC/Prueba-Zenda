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
  displayedColumns: string[] = [
    'name',
    'status',
    'species',
    'gender',
    'type',
    'created',
    'detalle',
    'favorito',
  ];
  speciesCount: { key: string; value: number }[] = [];
  typeCount: { key: string; value: number }[] = [];

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.rickAndMortyService.getCharacters().subscribe((response: any) => {
      this.characters = response.results;
      this.filteredCharacters = response.results;
      this.calculateTotals();
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
    this.calculateTotals();
  }

  verDetalles(character: any) {
    console.log('Personaje seleccionado en lista:', character);
    this.characterSelected.emit(character);
  }

  calculateTotals(): void {
    // Totales por especie
    const speciesMap = this.characters.reduce((acc: any, character: any) => {
      acc[character.species] = (acc[character.species] || 0) + 1;
      return acc;
    }, {});
    this.speciesCount = Object.entries(speciesMap).map(([key, value]) => ({
      key,
      value: value as number,
    }));

    // Totales por tipo
    const typeMap = this.characters.reduce((acc: any, character: any) => {
      acc[character.type || 'Unknown'] = (acc[character.type || 'Unknown'] || 0) + 1;
      return acc;
    }, {});
    this.typeCount = Object.entries(typeMap).map(([key, value]) => ({
      key,
      value: value as number,
    }));
  }
}
