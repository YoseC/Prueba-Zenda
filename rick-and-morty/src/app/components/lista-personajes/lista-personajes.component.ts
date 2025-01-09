import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit {
  row: any;
  characters: any[] = [];
  episodes: any[] = [];
  locations: any[] = [];
  filteredCharacters: any[] = [];
  filteredEpisodes: any[] = [];
  filteredLocations: any[] = [];
  displayedColumns: string[] = ['name', 'status', 'species', 'gender', 'type', 'created', 'detalle'];

  @Output()
  characterSelected = new EventEmitter<any>();
  episodeSelected = new EventEmitter<any>();
  locationSelected = new EventEmitter<any>();

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
  verInfo(episodes: any, locations: any) {
    console.log('Emitir episodios y ubicaciones:', episodes, locations);
    this.episodeSelected.emit(episodes);
    this.locationSelected.emit(locations);


    this.rickAndMortyService.getEpisodes().subscribe((response: any) => {
      this.episodes = response.results;
      console.log('Episodios:', this.episodes);
      this.filteredEpisodes = response.results;
    });
    this.rickAndMortyService.getLocations().subscribe((response: any) => {
      this.locations = response.results;
      console.log('Locations:', this.locations);
      this.filteredLocations = response.results;
    });
  }


}
