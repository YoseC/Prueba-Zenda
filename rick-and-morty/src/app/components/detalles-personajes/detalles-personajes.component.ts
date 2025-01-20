import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { DatePipe, NgIf } from '@angular/common';

@Component( {
  selector: 'detalles-personajes',
  templateUrl: './detalles-personajes.component.html',
  imports: [
    MatCardModule,
    NgIf,
    DatePipe
  ],
  styleUrls: [ './detalles-personajes.component.css' ]
})
export class DetallesPersonajesComponent implements OnChanges {
  @Input() character: any;
  origin: any;
  originResident: any;
  location: any;
  episode: any;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['character'] && this['character']) {
      this.loadAdditionalInfo();
    }
  }

  loadAdditionalInfo() {
    if (this['character'].origin.url) {
      this.rickAndMortyService.getLocation(this['character'].origin.url.split('/').pop()).subscribe((data) => {
        this.origin = data;
        if (this.origin.residents.length > 0) {
          this.rickAndMortyService.getCharacter(this.origin.residents[0].split('/').pop()).subscribe((resident) => {
            this.originResident = resident;
          });
        } else {
          this.originResident = { name: 'No tiene residentes' };
        }
      });
    } else {
      this.origin = { name: 'Desconocido', residents: [] };
      this.originResident = { name: 'No tiene residentes' };
    }

    if (this['character'].location.url) {
      this.rickAndMortyService.getLocation(this['character'].location.url.split('/').pop()).subscribe((data) => {
        this.location = data;
      });
    } else {
      this.location = { name: 'Desconocido', residents: [] };
    }

    if (this['character'].episode.length > 0) {
      this.rickAndMortyService.getEpisode(this['character'].episode[0].split('/').pop()).subscribe((data) => {
        this.episode = data;
      });
    } else {
      this.episode = { name: 'No tiene episodios' };
    }
  }
}
