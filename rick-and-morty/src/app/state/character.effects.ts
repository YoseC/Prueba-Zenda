import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RickAndMortyService } from '../services/rick-and-morty.service';
import { loadCharacters, loadCharactersSuccess, loadCharactersFailure } from './character.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CharacterEffects {
  private readonly actions$ = inject(Actions); // ✅ Usar `inject()` en Angular 16+
  private readonly store = inject(Store); // ✅ Usar `inject()` para el Store
  private readonly rickAndMortyService = inject(RickAndMortyService); // ✅ Inyección directa

  constructor() {}

  loadCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCharacters),
      mergeMap(() =>
        this.rickAndMortyService.getAllCharacters().pipe(
          map(characters => {
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
