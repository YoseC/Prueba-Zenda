import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit, signal, computed, effect } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatHeaderCell, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FavoritosService } from '../../services/favoritos.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DatePipe, NgIf, CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatSort,
    MatInput,
    MatHeaderCell,
    DatePipe,
    MatButton,
    MatIcon,
    MatIconButton,
    NgIf,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ListaPersonajesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() favoriteCharacter: any = null;
  @Output() favoriteSelected = new EventEmitter<any>();
  @Output() characterSelected = new EventEmitter<any>();

  displayedColumns: string[] = [
    'name',
    'status',
    'species',
    'gender',
    'type',
    'created',
    'detalle',
    'favorito',
  ];

  // ✅ Ahora `items` es un Signal reactivo
  items = signal<any[]>([]);

  // ✅ Filtros como Signals (antes eran `FormControl`)
  searchName = signal<string>('');
  searchSpecies = signal<string>('');
  searchStatus = signal<string>('');
  searchGender = signal<string>('');

  // ✅ Filtrado reactivo con `computed()`
  itemsFiltered = computed(() =>
    this.items().filter(character =>
      (!this.searchName() || character.name.toLowerCase().includes(this.searchName().toLowerCase())) &&
      (!this.searchSpecies() || character.species.toLowerCase().includes(this.searchSpecies().toLowerCase())) &&
      (!this.searchStatus() || this.searchStatus() === 'todo' || character.status === this.searchStatus()) &&
      (!this.searchGender() || this.searchGender() === 'todo' || character.gender === this.searchGender())
    )
  );

  // ✅ `MatTableDataSource` se actualiza automáticamente
  dataSource = computed(() => {
    const table = new MatTableDataSource(this.itemsFiltered());
    if (this.paginator) {
      table.paginator = this.paginator;
    }
    if (this.sort) {
      table.sort = this.sort;
    }
    return table;
  });

  // ✅ Contadores reactivos
  speciesCount = computed(() => new Set(this.itemsFiltered().map(c => c.species)).size);
  typeCount = computed(() => new Set(this.itemsFiltered().map(c => c.type)).size);
  totalCharacters = computed(() => this.itemsFiltered().length);
  genders = computed(() => [...new Set(this.itemsFiltered().map(c => c.gender))]);
  statuses = computed(() => [...new Set(this.itemsFiltered().map(c => c.status))]);

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private router: Router,
    private favoritosService: FavoritosService
  ) {
    // ✅ Carga automática de datos con `effect()`
    effect(() => {
      this.rickAndMortyService.getAllCharacters().subscribe((characters) => {
        this.items.set(characters); // Actualiza el Signal reactivo
      });
    });
  }

  // ✅  método `marcarFavorito()`
  marcarFavorito(character: any): void {
    this.favoritosService.setFavorito(character);
    this.favoriteSelected.emit(character);
    character.isFavorite = !character.isFavorite;
  }

  // ✅    método `esFavorito()`
  esFavorito(character: any): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  // ✅   `verDetalles()`
  verDetalles(character: any): void {
    this.characterSelected.emit(character);
    this.router.navigate(['/detalles-personajes', character.id]);
  }
}
