import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'detalles-personajes',
  templateUrl: './detalles-personajes.component.html',
  styleUrls: ['./detalles-personajes.component.css']
})
export class DetallesPersonajesComponent implements OnChanges {
  @Input() character: any;
  origin: any;
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
      });
    } else {
      this.origin = { name: 'Desconocido', residents: [] };
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
