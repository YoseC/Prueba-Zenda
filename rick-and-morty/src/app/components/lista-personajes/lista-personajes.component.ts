import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'app-lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];

  @Output()
  characterSelected = new EventEmitter<any>();

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getCharacters().subscribe((response: any) => {
      this.characters = response.results;
      this.filteredCharacters = response.results;
    });
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
