import { createReducer, on } from '@ngrx/store';
import { loadCharacters, loadCharactersSuccess, loadCharactersFailure } from './character.actions';
import { CharacterState, initialState } from './character.state';

export const characterReducer = createReducer(
  initialState,
  on(loadCharacters, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadCharactersSuccess, (state, { characters }) => {
    console.log('✅ Datos recibidos en Redux:', characters);
    return {
      ...state,
      loading: false,
      characters
    };
  }),
  on(loadCharactersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);


// loadCharacters: Activa el estado de carga.
// loadCharactersSuccess: Almacena los personajes y desactiva la carga.
// loadCharactersFailure: Guarda el error si ocurre un problema.
