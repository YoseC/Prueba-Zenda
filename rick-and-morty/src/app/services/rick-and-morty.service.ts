import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private apiUrlEpisode = 'https://rickandmortyapi.com/api/episode';
  private apiUrlLocation = 'https://rickandmortyapi.com/api/location';
  private cache = new Map<number, any[]>(); // Cache para páginas cargadas

  constructor(private http: HttpClient) {}

  // Obtener la lista de personajes (por página)
  getCharacters(page: number): Observable<any[]> {
    if (this.cache.has(page)) {
      return of(this.cache.get(page)!); // Retorna la página cacheada
    }

    return this.http.get<any>(`${this.apiUrl}?page=${page}`).pipe(
      tap((response) => {
        if (response && response.results) {
          this.cache.set(page, response.results); // Cachea solo si la respuesta es válida
        }
      }),
      map((response) => response.results || []), // Retorna un array vacío si no hay resultados
      catchError((error) => {
        console.error(`Error fetching characters for page ${page}:`, error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  // Obtener todos los personajes de manera recursiva
  getAllCharacters(url: string = this.apiUrl, result: any[] = []): Observable<any[]> {
    return this.http.get<any>(url).pipe(
      switchMap((response) => {
        result.push(...response.results); // Acumula los personajes de la página actual
        if (response.info.next) {
          // Si hay una siguiente página, llama recursivamente
          return this.getAllCharacters(response.info.next, result);
        }
        // Si no hay más páginas, retorna los resultados acumulados
        return of(result);
      }),
      catchError((error) => {
        console.error('Error fetching all characters:', error);
        return of(result); // Retorna los resultados acumulados, aunque incompletos
      })
    );
  }

  getEpisodes(): Observable<any> {
    return this.http.get<any>(this.apiUrlEpisode).pipe(
      catchError(error => {
        console.error('Error fetching episodes:', error);
        return of([]);
      })
    );
  }

  getLocations(): Observable<any> {
    return this.http.get<any>(this.apiUrlLocation).pipe(
      catchError(error => {
        console.error('Error fetching locations:', error);
        return of([]);
      })
    );
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching character with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getLocation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlLocation}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching location with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getEpisode(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlEpisode}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching episode with id ${id}:`, error);
        return of(null);
      })
    );
  }
}
