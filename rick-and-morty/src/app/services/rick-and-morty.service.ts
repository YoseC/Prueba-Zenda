import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<any>(this.apiUrl);
  }
  getEpisodes(): Observable<any> {
    return this.http.get<any>(this.apiUrlEpisode);
  }
  getLocations(): Observable<any> {
    return this.http.get<any>(this.apiUrlLocation);
  }
}
