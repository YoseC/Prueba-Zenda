import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RickAndMortyService } from '../services/rick-and-morty.service';
import { loadCharacters, loadCharactersSuccess, loadCharactersFailure } from './character.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class CharacterEffects {

    private actions$ = inject(Actions);  // ✅ Usamos `inject()` en lugar del constructor
    private rickAndMortyService = inject(RickAndMortyService);  // ✅ También para el servicio



  loadCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCharacters),
      tap(() => console.log('⚡ Acción loadCharacters detectada en Effects')),
      mergeMap(() =>
        this.rickAndMortyService.getAllCharacters().pipe(
          tap(() => console.log('🌍 Llamando a la API de Rick and Morty')),
          map(characters => {
            // console.log('✅ Efecto ejecutado - Datos cargados en Redux:', characters);
            return loadCharactersSuccess({ characters });
          }),
          catchError(error => {
            console.error('❌ Error en loadCharacters:', error);
            return of(loadCharactersFailure({ error: error.message }));
          })
        )
      )
    )
  );
}



// 1️⃣ Elimina la inyección en el constructor y usa inject(Actions) en su lugar.

// Angular 19 introduce un nuevo sistema de inyección basado en inject().
// A veces, los servicios inyectados en el constructor no se instancian correctamente.
// inject(Actions) se asegura de que Actions siempre esté disponible.
// 2️⃣ Aplica inject(RickAndMortyService) en lugar de pasarlo en el constructor.

// Esto sigue el mismo principio: evita problemas de inyección en Angular 19.
