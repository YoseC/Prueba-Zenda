import { Character } from '../interfaces/character.interface';

export interface CharacterState {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

export const initialState: CharacterState = {
  characters: [],
  loading: false,
  error: null
};
