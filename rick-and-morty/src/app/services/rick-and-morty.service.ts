import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private apiUrlEpisode = 'https://rickandmortyapi.com/api/episode';
  private apiUrlLocation = 'https://rickandmortyapi.com/api/location';

  constructor(private http: HttpClient) {}

  // Obtener la lista de personajes
  getCharacters(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results),
      shareReplay(1), // Cache los resultados
      catchError(error => {
        console.error('Error fetching characters:', error);
        return of([]);
      })
    );
  }

  getEpisodes(): Observable<any> {
    return this.http.get<any>(this.apiUrlEpisode).pipe(
      shareReplay(1),
      catchError(error => {
        console.error('Error fetching episodes:', error);
        return of([]);
      })
    );
  }

  getLocations(): Observable<any> {
    return this.http.get<any>(this.apiUrlLocation).pipe(
      shareReplay(1),
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
