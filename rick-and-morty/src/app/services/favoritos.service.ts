import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritoSubject = new BehaviorSubject<any>(null); // Estado inicial

  favorito$ = this.favoritoSubject.asObservable(); // Observable público

  setFavorito(personaje: any): void {
    this.favoritoSubject.next(personaje); // Emite un nuevo favorito
  }
}

