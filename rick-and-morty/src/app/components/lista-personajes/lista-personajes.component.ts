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
import { selectAllCharacters } from '../../state/character.selectors';
import { ChangeDetectorRef } from '@angular/core';



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
    'name', 'status', 'species', 'gender', 'type', 'created', 'detalle', 'favorito'
  ];

  private store = inject(Store);
  characters: Character[] = [];
  dataSource = new MatTableDataSource<Character>();

  // ✅ Filtros
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('todo');
  searchGender = new FormControl('todo');

  // ✅ Contadores reactivos
  speciesCount = signal(0);
  typeCount = signal(0);
  totalCharacters = signal(0);
  genders = signal<string[]>([]);
  statuses = signal<string[]>([]);

  constructor(
    private router: Router,
    private favoritosService: FavoritosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadCharacters());

    // ✅ Obtener personajes de Redux
    this.store.select(selectAllCharacters).subscribe((characters) => {
      this.characters = characters;
      this.dataSource.data = characters;
      this.inicializarPaginador();
      this.actualizarContadores(); // 🔥 Actualizar contadores cuando se cargan los datos
    });

    // ✅ Configurar `filterPredicate`
    this.dataSource.filterPredicate = (data: Character, filter: string) => {
      const search = JSON.parse(filter);
      return (
        (!search.name || data.name.toLowerCase().includes(search.name.toLowerCase())) &&
        (!search.species || data.species.toLowerCase().includes(search.species.toLowerCase())) &&
        (search.status === 'todo' || data.status === search.status) &&
        (search.gender === 'todo' || data.gender === search.gender)
      );
    };

    // ✅ Aplicar filtros cuando los valores cambian
    this.searchName.valueChanges.subscribe(() => this.aplicarFiltros());
    this.searchSpecies.valueChanges.subscribe(() => this.aplicarFiltros());
    this.searchStatus.valueChanges.subscribe(() => this.aplicarFiltros());
    this.searchGender.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  private inicializarPaginador(): void {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  // ✅ Método para aplicar los filtros y actualizar contadores
  private aplicarFiltros(): void {
    const filterValues = {
      name: this.searchName.value?.trim().toLowerCase() || '',
      species: this.searchSpecies.value?.trim().toLowerCase() || '',
      status: this.searchStatus.value || 'todo',
      gender: this.searchGender.value || 'todo',
    };

    this.dataSource.filter = JSON.stringify(filterValues);

    // ✅ Reiniciar paginador al filtrar
    if (this.paginator) {
      this.paginator.firstPage();
    }

    // ✅ Actualizar contadores después de aplicar filtros
    setTimeout(() => {
      this.actualizarContadores();
    });
  }

  private actualizarContadores(): void {
    const filteredData = this.dataSource.filteredData;

    // 🔥 Forzar detección de cambios
    this.speciesCount.set(new Set(filteredData.map(c => c.species)).size);
    this.typeCount.set(new Set(filteredData.map(c => c.type)).size);
    this.totalCharacters.set(filteredData.length);
    this.genders.set([...new Set(filteredData.map(c => c.gender))]);
    this.statuses.set([...new Set(filteredData.map(c => c.status))]);

    this.cdr.detectChanges(); // 🔥 Asegurar actualización en la vista
  }

  // ✅ Método `marcarFavorito()`
  marcarFavorito(character: Character): void {
    this.favoritosService.setFavorito(character);
    this.favoriteSelected.emit(character);

    // ✅ Clona el objeto para evitar modificar directamente el estado de Redux
    const updatedCharacter = { ...character, isFavorite: !character.isFavorite };

    // ✅ Reemplaza el objeto en el dataSource
    this.dataSource.data = this.dataSource.data.map(c =>
      c.id === updatedCharacter.id ? updatedCharacter : c
    );

    this.actualizarContadores(); // 🔥 Asegurar que los contadores también se actualicen
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
