import { Component, Input, OnChanges, SimpleChanges, signal, effect, input } from '@angular/core';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'detalles-personajes',
  templateUrl: './detalles-personajes.component.html',
  styleUrls: ['./detalles-personajes.component.css'],
  imports: [MatCardModule,
    MatCard,
    NgIf,
    DatePipe],
})
export class DetallesPersonajesComponent {
  // Signals para manejar los datos de manera reactiva
  character = signal<any>(null);
  origin = signal<any>({ name: 'Desconocido', residents: [] });
  originResident = signal<any>({ name: 'No tiene residentes' });
  location = signal<any>({ name: 'Desconocido', residents: [] });
  episode = signal<any>({ name: 'No tiene episodios' });
  id = input<string | null>(null); // Signal para manejar el id del personaje

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private route: ActivatedRoute
  ) {
    // Efecto para detectar cambios en la URL y cargar los datos
    effect(() => {
      console.log( 'this.id()', this.id() );
      // const newId = this.route.snapshot.paramMap.get('id');
      // if (newId && this.id() !== newId) {
      //   this.id.set(newId);
       this.loadCharacterDetails(this.id());
      // }
    });
  }

  loadCharacterDetails(id: string | null): void {
    this.rickAndMortyService.getCharacter(Number(id)).subscribe((character) => {
      this.character.set(character);
      this.loadAdditionalInfo();
    });
  }

  loadAdditionalInfo(): void {
    const character = this.character();

    // Cargar ubicación de origen
    if (character?.origin?.url) {
      this.rickAndMortyService
        .getLocation(character.origin.url.split('/').pop())
        .subscribe((data) => {
          this.origin.set(data);
          if (data.residents.length > 0) {
            const residentId = data.residents[0].split('/').pop();
            if (residentId) {
              this.rickAndMortyService
                .getCharacter(residentId)
                .subscribe((resident) => this.originResident.set(resident));
            }
          } else {
            this.originResident.set({ name: 'No tiene residentes' });
          }
        });
    } else {
      this.origin.set({ name: 'Desconocido', residents: [] });
      this.originResident.set({ name: 'No tiene residentes' });
    }

    // Cargar ubicación actual
    if (character?.location?.url) {
      this.rickAndMortyService
        .getLocation(character.location.url.split('/').pop())
        .subscribe((data) => this.location.set(data));
    } else {
      this.location.set({ name: 'Desconocido', residents: [] });
    }

    // Cargar primer episodio
    if (character?.episode?.length > 0) {
      const episodeId = character.episode[0].split('/').pop();
      if (episodeId) {
        this.rickAndMortyService
          .getEpisode(episodeId)
          .subscribe((data) => this.episode.set(data));
      }
    } else {
      this.episode.set({ name: 'No tiene episodios' });
    }
  }
}
