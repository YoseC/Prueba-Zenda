import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private apiUrlEpisode = 'https://rickandmortyapi.com/api/episode';
  private apiUrlLocation = 'https://rickandmortyapi.com/api/location';

  private charactersCache: Character[] | null = null; // ✅ Guardar en memoria

  constructor(private http: HttpClient) {}

  // ✅ Guardar en localStorage
  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ✅ Obtener desde localStorage
  private getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // ✅ Obtener TODOS los personajes sin hacer la petición varias veces
  getAllCharacters(): Observable<Character[]> {
    // 🔹 1. Verifica si los datos están en memoria
    if (this.charactersCache) {
      console.log('🔹 Usando datos en memoria');
      return of(this.charactersCache);
    }

    // 🔹 2. Verifica si los datos están en `localStorage`
    const cachedData = this.getFromLocalStorage('allCharacters');
    if (cachedData) {
      console.log('🔹 Usando datos desde localStorage');
      this.charactersCache = cachedData; // ✅ Guardar en memoria
      return of(cachedData);
    }

    // 🔹 3. Si no hay caché, obtenemos los personajes de todas las páginas
    return this.fetchAllPages(this.apiUrl, []);
  }

  // ✅ Método privado para obtener todas las páginas de la API de manera recursiva
  private fetchAllPages(url: string, result: Character[]): Observable<Character[]> {
    console.log('📡 Cargando página:', url); // Debug

    return this.http.get<{ info: { next: string | null }, results: Character[] }>(url).pipe(
      switchMap(response => {
        result.push(...response.results); // 🔹 Agregar personajes de la página actual
        console.log('📦 Datos acumulados hasta ahora:', result.length); // Debug

        if (response.info.next) {
          return this.fetchAllPages(response.info.next, result); // 🔄 Llamado recursivo
        }

        // ✅ Guardar los datos en memoria y en `localStorage` solo cuando todas las páginas se hayan cargado
        this.charactersCache = result;
        this.saveToLocalStorage('allCharacters', result);
        console.log('✅ Todos los personajes guardados en localStorage:', result.length);

        return of(result);
      }),
      catchError(error => {
        console.error('❌ Error al obtener personajes:', error);
        return of(result);
      })
    );
  }

  // ✅ Obtener todos los géneros únicos
  getAllGenders(): Observable<string[]> {
    return this.getAllCharacters().pipe(
      map(characters => [...new Set(characters.map(character => character.gender))])
    );
  }

  // ✅ Obtener todos los estados únicos
  getAllStatuses(): Observable<string[]> {
    return this.getAllCharacters().pipe(
      map(characters => [...new Set(characters.map(character => character.status))])
    );
  }

  // ✅ Obtener episodios
  getEpisodes(): Observable<any> {
    return this.http.get<{ results: any[] }>(this.apiUrlEpisode).pipe(
      map(response => response.results || []),
      catchError(error => {
        console.error('❌ Error al obtener episodios:', error);
        return of([]);
      })
    );
  }

  // ✅ Obtener locaciones
  getLocations(): Observable<any> {
    return this.http.get<{ results: any[] }>(this.apiUrlLocation).pipe(
      map(response => response.results || []),
      catchError(error => {
        console.error('❌ Error al obtener locaciones:', error);
        return of([]);
      })
    );
  }

  // ✅ Obtener un personaje por ID
  getCharacter(id: number): Observable<Character | null> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`❌ Error al obtener el personaje con ID ${id}:`, error);
        return of(null);
      })
    );
  }

  // ✅ Obtener una locación por ID
  getLocation(id: number): Observable<any | null> {
    return this.http.get<any>(`${this.apiUrlLocation}/${id}`).pipe(
      catchError(error => {
        console.error(`❌ Error al obtener la locación con ID ${id}:`, error);
        return of(null);
      })
    );
  }

  // ✅ Obtener un episodio por ID
  getEpisode(id: number): Observable<any | null> {
    return this.http.get<any>(`${this.apiUrlEpisode}/${id}`).pipe(
      catchError(error => {
        console.error(`❌ Error al obtener el episodio con ID ${id}:`, error);
        return of(null);
      })
    );
  }
}
