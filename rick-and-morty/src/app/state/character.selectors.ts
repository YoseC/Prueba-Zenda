import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CharacterState } from './character.state';

// 📌 Selecciona el estado de los personajes
export const selectCharacterState = (state: any) => state.characterState;

// 📌 Obtiene la lista de personajes
export const selectAllCharacters = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.characters
);

// 📌 Obtiene el estado de carga
export const selectCharactersLoading = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.loading
);

// 📌 Obtiene errores si ocurren
export const selectCharactersError = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.error
);
