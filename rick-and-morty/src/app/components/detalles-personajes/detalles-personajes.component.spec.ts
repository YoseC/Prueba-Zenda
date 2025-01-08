import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPersonajesComponent } from './detalles-personajes.component';

describe('DetallesPersonajesComponent', () => {
  let component: DetallesPersonajesComponent;
  let fixture: ComponentFixture<DetallesPersonajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallesPersonajesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPersonajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
