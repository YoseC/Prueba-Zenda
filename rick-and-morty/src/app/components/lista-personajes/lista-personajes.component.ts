import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit,signal, computed, effect, Signal } from '@angular/core';
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
import { Character } from '../../interfaces/character.interface';

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

    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ListaPersonajesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() favoriteCharacter: Character | null = null;
  @Output() favoriteSelected = new EventEmitter<Character>();
  @Output() characterSelected = new EventEmitter<Character>();

  displayedColumns: string[] = ['name', 'status', 'species', 'gender', 'type', 'created', 'detalle', 'favorito'];

  // ✅ Estado reactivo de personajes
  items = signal<Character[]>([]);
  dataSource = new MatTableDataSource<Character>([]);

  // ✅ Filtros reactivos
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('todo');
  searchGender = new FormControl('todo');

  // ✅ Signals sincronizados con filtros
  searchNameSignal = signal('');
  searchSpeciesSignal = signal('');
  searchStatusSignal = signal('todo');
  searchGenderSignal = signal('todo');

  pageSize = signal<number>(10);

  private destroy$ = new Subject<void>(); // 🔹 Para limpiar suscripciones y evitar memory leaks

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private router: Router,
    public favoritosService: FavoritosService
  ) {}

  ngOnInit() {
    // 🔹 Cargar personajes de la API
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$)) // 🚀 Evita fugas de memoria al destruir el componente
      .subscribe(characters => {
        this.items.set(characters);
      });

    // 🔹 Sincronizar `FormControl` con Signals sin `subscribe()`
    this.searchName.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.searchNameSignal.set(value?.trim() ?? ''));

    this.searchSpecies.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.searchSpeciesSignal.set(value?.trim() ?? ''));

    this.searchStatus.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.searchStatusSignal.set(value ?? 'todo'));

    this.searchGender.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.searchGenderSignal.set(value ?? 'todo'));

    // 🔹 Mantener `MatTableDataSource` actualizado dinámicamente
    effect(() => {
      this.dataSource.data = this.itemsFiltered();
    });
  }

  ngAfterViewInit() {
    // 🔹 Conectar paginador y ordenamiento después de que el componente esté listo
    effect(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ Filtro automático con `computed()`
  itemsFiltered = computed(() =>
    this.items().filter(character =>
      (!this.searchNameSignal() || character.name.toLowerCase().includes(this.searchNameSignal().toLowerCase())) &&
      (!this.searchSpeciesSignal() || character.species.toLowerCase().includes(this.searchSpeciesSignal().toLowerCase())) &&
      (!this.searchStatusSignal() || this.searchStatusSignal() === 'todo' || character.status === this.searchStatusSignal()) &&
      (!this.searchGenderSignal() || this.searchGenderSignal() === 'todo' || character.gender === this.searchGenderSignal())
    )
  );

  // ✅ Contadores reactivos
  speciesCount = computed(() => new Set(this.itemsFiltered().map(c => c.species)).size);
  typeCount = computed(() => new Set(this.itemsFiltered().map(c => c.type)).size);
  totalCharacters = computed(() => this.itemsFiltered().length);
  genders = computed(() => [...new Set(this.itemsFiltered().map(c => c.gender))]);
  statuses = computed(() => [...new Set(this.itemsFiltered().map(c => c.status))]);

  // ✅ Marcar o desmarcar como favorito
  marcarFavorito(character: Character): void {
    if (this.esFavorito(character)) {
     this.favoritosService.removeFavorito(character);
    } else {
      this.favoritosService.setFavorito(character);
    }
    this.favoriteSelected.emit(character);
    character.isFavorite = !character.isFavorite;
  }

  // ✅ Verificar si un personaje es favorito
  esFavorito(character: Character): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  // ✅ Navegar a detalles del personaje
  verDetalles(character: Character): void {
    this.characterSelected.emit(character);
    this.router.navigate(['/detalles-personajes', character.id]);
  }
}
