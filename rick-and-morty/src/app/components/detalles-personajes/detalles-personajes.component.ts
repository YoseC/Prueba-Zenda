import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalles-personajes',
  templateUrl: './detalles-personajes.component.html',
  styleUrls: ['./detalles-personajes.component.css']
})
export class DetallesPersonajesComponent {
  private _character: any;

  @Input()
  set character(value: any) {
    console.log('Detalles recibidos en detalles-personajes:', value); // Depuración
    this._character = value;
  }

  get character() {
    return this._character;
  }
}
