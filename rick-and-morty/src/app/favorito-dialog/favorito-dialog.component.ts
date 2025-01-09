import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'favorito-dialog',
  templateUrl: './favorito-dialog.component.html',
  styleUrls: ['./favorito-dialog.component.css']
})
export class FavoritoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  
}
