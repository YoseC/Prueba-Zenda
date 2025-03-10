import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, of, switchMap} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyGraphqlService {
  constructor(private apollo: Apollo) {}

  // Consulta optimizada con filtros
  private readonly CHARACTERS_FILTER_QUERY = gql`
    query GetFilteredCharacters($page: Int, $filter: FilterCharacter) {
      characters(page: $page, filter: $filter) {
        info {
          pages
          next
          prev
        }
        results {
          id
          name
          status
          species
          type
          gender
          image
          created
          origin {
            name
          }
          location {
            name
          }
        }
      }
    }
  `;

  // Método para obtener personajes con filtrado
  getAllCharacters(filter = {}): Observable<Character[]> {
    console.log('Obteniendo personajes con filtro GraphQL');
    
    // Inicializamos con la primera página
    return this.getFilteredCharacters(1, filter);
  }

  private getFilteredCharacters(page: number = 1, filter = {}, accumulator: Character[] = []): Observable<Character[]> {
      return this.apollo.query<any>({
        query: this.CHARACTERS_FILTER_QUERY,
        variables: { page, filter },
        fetchPolicy: 'cache-first'
      }).pipe(
        switchMap(result => {
          const data = result.data.characters;
          const newCharacters = data.results.map((char: any) => ({
            id: char.id,
            name: char.name,
            status: char.status,
            species: char.species,
            type: char.type || '',
            gender: char.gender,
            origin: char.origin.name,
            location: char.location.name,
            image: char.image,
            created: char.created,
            isFavorite: false
          }));
          
          // Acumulamos los personajes obtenidos
          const allCharacters = [...accumulator, ...newCharacters];
          
          // Si hay más páginas, las cargamos recursivamente
          if (data.info.next) {
            return this.getFilteredCharacters(page + 1, filter, allCharacters);
          } else {
            console.log(`Total de personajes cargados: ${allCharacters.length}`);
            return of(allCharacters); // Devolvemos un Observable con el array
          }
        }),
        catchError(error => {
          console.error(`Error obteniendo personajes filtrados (página ${page}):`, error);
          return of(accumulator); // Devolvemos lo que hayamos acumulado hasta el error
        })
      );
    }

  // Método para obtener un solo personaje por ID
  getCharacterById(id: string): Observable<Character | null> {
    return this.apollo.query<any>({
      query: gql`
        query GetCharacter($id: ID!) {
          character(id: $id) {
            id
            name
            status
            species
            type
            gender
            image
            created
            origin {
              name
            }
            location {
              name
            }
            episode {
              name
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        const char = result.data.character;
        if (!char) return null;

        return {
          id: char.id,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type || '',
          gender: char.gender,
          origin: char.origin.name,
          location: char.location.name,
          image: char.image,
          created: char.created,
          episode: char.episode.map((ep: any) => ep.name),
          isFavorite: false
        };
      }),
      catchError(error => {
        console.error(`Error obteniendo el personaje ${id}:`, error);
        return of(null);
      })
    );
  }
}