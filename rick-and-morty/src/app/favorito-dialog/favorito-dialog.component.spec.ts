import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritoDialogComponent } from './favorito-dialog.component';

describe('FavoritoDialogComponent', () => {
  let component: FavoritoDialogComponent;
  let fixture: ComponentFixture<FavoritoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoritoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
