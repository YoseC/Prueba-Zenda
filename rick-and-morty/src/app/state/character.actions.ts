import { createAction, props } from '@ngrx/store';
import { Character } from '../interfaces/character.interface';

export const loadCharacters = createAction('[Character] Load Characters');
export const loadCharactersSuccess = createAction(
  '[Character] Load Characters Success',
  props<{ characters: Character[] }>()
);
export const loadCharactersFailure = createAction(
  '[Character] Load Characters Failure',
  props<{ error: string }>()
);


// loadCharacters: Se activa cuando se inicia la carga de personajes.
// loadCharactersSuccess: Se dispara cuando la carga es exitosa y recibe los personajes.
// loadCharactersFailure: Se activa cuando ocurre un error y almacena el mensaje de error.
