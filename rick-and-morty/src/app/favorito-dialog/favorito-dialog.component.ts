import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component( {
  selector: 'favorito-dialog',
  templateUrl: './favorito-dialog.component.html',
  imports: [
    MatCardModule,
    MatButton,
    MatDialogClose
  ],
  styleUrls: [ './favorito-dialog.component.css' ]
})
export class FavoritoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}


}
