import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyGraphqlService {
  constructor(private apollo: Apollo) {}

  // ✅ Consulta GraphQL para obtener todos los personajes
  getAllCharacters(): Observable<Character[]> {
    return this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            characters {
              results {
                id
                name
                status
                species
                gender
                image
                origin {
                  name
                }
                location {
                  name
                }
              }
            }
          }
        `
      })
      .valueChanges.pipe(
        map(result => result.data.characters.results)
      );
  }
}
