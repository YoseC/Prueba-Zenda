import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyGraphqlService {
  constructor(private apollo: Apollo) {}

  // Consulta para obtener la información de paginación
  private readonly INFO_QUERY = gql`
    query {
      characters {
        info {
          count
          pages
        }
      }
    }
  `;

  // Consulta para obtener personajes por página
  private readonly CHARACTERS_QUERY = gql`
    query GetCharactersPage($page: Int!) {
      characters(page: $page) {
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

  // Método principal para obtener todos los personajes
  getAllCharacters(): Observable<Character[]> {
    console.log('Obteniendo todos los personajes con GraphQL');

    // 1. Primero obtenemos la información de cuántas páginas hay
    return this.apollo.query<any>({
      query: this.INFO_QUERY,
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => result.data.characters.info.pages),
      mergeMap(totalPages => {
        console.log(`Total de páginas a cargar: ${totalPages}`);

        // 2. Creamos un array con los números de página (1 a totalPages)
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        // 3. Para cada página, creamos una consulta
        const pageQueries = pages.map(page => this.getCharactersPage(page));

        // 4. Ejecutamos todas las consultas en paralelo y combinamos los resultados
        return forkJoin(pageQueries).pipe(
          map(results => {
            // 5. Combinamos todos los arrays de personajes en uno solo
            return results.flat();
          })
        );
      }),
      catchError(error => {
        console.error('Error obteniendo personajes:', error);
        return of([]);
      })
    );
  }

  // Método auxiliar para obtener una página específica
  private getCharactersPage(page: number): Observable<Character[]> {
    return this.apollo.query<any>({
      query: this.CHARACTERS_QUERY,
      variables: { page },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        // Convertimos los datos al formato que espera tu aplicación
        return result.data.characters.results.map((char: any) => ({
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
          isFavorite: false // Campo adicional para tu lógica de favoritos
        }));
      }),
      catchError(error => {
        console.error(`Error obteniendo la página ${page}:`, error);
        return of([]);
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
              name}
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
