import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit, signal, computed, effect, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatHeaderCell, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FavoritosService } from '../../services/favoritos.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DatePipe, NgIf, CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Character } from '../../interfaces/character.interface';
import { loadCharacters } from '../../state/character.actions';
import { selectAllCharacters } from '../../state/character.selectors'; // ✅ Corrige el import




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
export class ListaPersonajesComponent implements OnInit {
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

  // ✅ Obtenemos los datos desde Redux
  private store = inject(Store);
  characters$: Observable<Character[]> = this.store.select(selectAllCharacters);
  dataSource = new MatTableDataSource<Character>();

  // ✅ Filtros
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('todo');
  searchGender = new FormControl('todo');

  constructor(
    private router: Router,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadCharacters());

    // ✅ Suscribimos Redux a MatTableDataSource
    this.characters$.subscribe(characters => {
      // console.log('✅ Datos recibidos en Redux ):', characters);
      this.dataSource.data = characters;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });

  }

  // ✅ Mueve `effect()` fuera de `ngOnInit()` y conviértelo en una propiedad de la clase
  effectFilterSync = effect(() => {
    this.searchName.valueChanges.subscribe(value => this.searchNameSignal.set(value?.trim() ?? ''));
    this.searchSpecies.valueChanges.subscribe(value => this.searchSpeciesSignal.set(value?.trim() ?? ''));
    this.searchStatus.valueChanges.subscribe(value => this.searchStatusSignal.set(value ?? ''));
    this.searchGender.valueChanges.subscribe(value => this.searchGenderSignal.set(value ?? ''));
  });

  // ✅ Signals sincronizados con los filtros
  searchNameSignal = signal(this.searchName.value ?? '');
  searchSpeciesSignal = signal(this.searchSpecies.value ?? '');
  searchStatusSignal = signal(this.searchStatus.value ?? 'todo');
  searchGenderSignal = signal(this.searchGender.value ?? 'todo');

  // ✅ Filtrado automático con `computed()`
  itemsFiltered = computed(() =>
    this.dataSource.data.filter(character =>
      (!this.searchNameSignal() || character.name.toLowerCase().includes(this.searchNameSignal().toLowerCase())) &&
      (!this.searchSpeciesSignal() || character.species.toLowerCase().includes(this.searchSpeciesSignal().toLowerCase())) &&
      (!this.searchStatusSignal() || this.searchStatusSignal() === 'todo' || character.status === this.searchStatusSignal()) &&
      (!this.searchGenderSignal() || this.searchGenderSignal() === 'todo' || character.gender === this.searchGenderSignal())
    )
  );

  // ✅ Contadores
  speciesCount = computed(() => new Set(this.itemsFiltered().map(c => c.species)).size);
  typeCount = computed(() => new Set(this.itemsFiltered().map(c => c.type)).size);
  totalCharacters = computed(() => this.itemsFiltered().length);
  genders = computed(() => [...new Set(this.dataSource.data.map(c => c.gender))]);
  statuses = computed(() => [...new Set(this.dataSource.data.map(c => c.status))]);

  // ✅ Método `marcarFavorito()`
  marcarFavorito(character: Character): void {
    this.favoritosService.setFavorito(character);
    this.favoriteSelected.emit(character);
    // character.isFavorite = !character.isFavorite; da error en consola porque es una propiedad de solo lectura o sea inmutable
 // ✅ Clona el objeto para evitar modificar directamente el estado de Redux
 const updatedCharacter = { ...character, isFavorite: !character.isFavorite };

 // ✅ Reemplaza el objeto en el dataSource
 this.dataSource.data = this.dataSource.data.map(c =>
   c.id === updatedCharacter.id ? updatedCharacter : c
 );

  }

  // ✅ Método `esFavorito()`
  esFavorito(character: Character): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  // ✅ Método `verDetalles()`
  verDetalles(character: Character): void {
    this.characterSelected.emit(character);
    this.router.navigate(['/detalles-personajes', character.id]);
  }
}
