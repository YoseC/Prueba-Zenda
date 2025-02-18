import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CharacterState } from './character.state';

// Obtiene todo el estado de personajes
export const selectCharacterState = createFeatureSelector<CharacterState>('characterState');

// Obtiene solo los personajes
export const selectAllCharacters = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.characters
);
