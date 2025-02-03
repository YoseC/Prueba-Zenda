import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../interfaces/character.interface'; // Asegúrate de importar la interfaz correcta

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<Character[]>([]); // ✅ Ahora es una lista de favoritos
  favoritos$ = this.favoritosSubject.asObservable(); // ✅ Observable público

  // ✅ Obtener la lista de favoritos actual
  getFavoritos(): Character[] {
    return this.favoritosSubject.value;
  }

  // ✅ Agregar un favorito (evita duplicados)
  setFavorito(personaje: Character): void {
    const favoritos = this.getFavoritos();
    if (!favoritos.some(fav => fav.id === personaje.id)) {
      this.favoritosSubject.next([...favoritos, personaje]); // ✅ Agrega un nuevo favorito sin mutar el array original
    }
  }

  // ✅ Eliminar un favorito
  removeFavorito(personaje: Character): void {
    const favoritos = this.getFavoritos().filter(fav => fav.id !== personaje.id);
    this.favoritosSubject.next(favoritos); // ✅ Actualiza la lista eliminando el personaje
  }

  // ✅ Verifica si un personaje es favorito
  esFavorito(personaje: Character): boolean {
    return this.getFavoritos().some(fav => fav.id === personaje.id);
  }
}
