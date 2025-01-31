export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type?: string; // Puede estar vacío
  gender: 'Male' | 'Female' | 'Genderless' | 'unknown';
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[]; // Lista de episodios en los que aparece
  created: string; // Fecha en formato ISO
  isFavorite?: boolean; // Propiedad para favoritos
}
