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
  // ✅ Signal para manejar los personajes
  items = signal<any[]>([]);

  // ✅ Filtros como FormControl
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('todo');
  searchGender = new FormControl('todo');

  // ✅ Signals sincronizados con los filtros
  searchNameSignal = signal(this.searchName.value ?? '');
  searchSpeciesSignal = signal(this.searchSpecies.value ?? '');
  searchStatusSignal = signal(this.searchStatus.value ?? 'todo');
  searchGenderSignal = signal(this.searchGender.value ?? 'todo');
  pageSize = signal<number>(10);

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private router: Router,
    private favoritosService: FavoritosService
  ) {
    // ✅ Sincroniza los FormControls con Signals automáticamente
    effect(() => {
      this.searchName.valueChanges.subscribe(value => this.searchNameSignal.set(value?.trim() ?? ''));
      this.searchSpecies.valueChanges.subscribe(value => this.searchSpeciesSignal.set(value?.trim() ?? ''));
      this.searchStatus.valueChanges.subscribe(value => this.searchStatusSignal.set(value ?? ''));
      this.searchGender.valueChanges.subscribe(value => this.searchGenderSignal.set(value ?? ''));
    });

    // ✅ Carga automática de datos con `effect()`
    effect(() => {
      this.rickAndMortyService.getAllCharacters().subscribe((characters) => {
        this.items.set(characters);
      });
    });
  }

  // ✅ Filtrado automático con `computed()`
  itemsFiltered = computed(() =>
    this.items().filter(character =>
      (!this.searchNameSignal() || character.name.toLowerCase().includes(this.searchNameSignal().toLowerCase())) &&
      (!this.searchSpeciesSignal() || character.species.toLowerCase().includes(this.searchSpeciesSignal().toLowerCase())) &&
      (!this.searchStatusSignal() || this.searchStatusSignal() === 'todo' || character.status === this.searchStatusSignal()) &&
      (!this.searchGenderSignal() || this.searchGenderSignal() === 'todo' || character.gender === this.searchGenderSignal())
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

  // ✅ Método `marcarFavorito()`
  marcarFavorito(character: any): void {
    this.favoritosService.setFavorito(character);
    this.favoriteSelected.emit(character);
    character.isFavorite = !character.isFavorite;
  }

  // ✅ Método `esFavorito()`
  esFavorito(character: any): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  // ✅ Método `verDetalles()`
  verDetalles(character: any): void {
    this.characterSelected.emit(character);
    this.router.navigate(['/detalles-personajes', character.id]);
  }
}
