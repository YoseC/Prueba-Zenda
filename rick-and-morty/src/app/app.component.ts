import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


  export class AppComponent {
    selectedCharacter: any = null;

    verDetalles(character: any) {
      console.log('Personaje recibido en AppComponent:', character); // Depuración
      this.selectedCharacter = character;
    }
}
