import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Subject, BehaviorSubject, combineLatest, takeUntil } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() favoriteCharacter: any = null;
  @Output() favoriteSelected = new EventEmitter<any>();
  @Output() characterSelected = new EventEmitter<any>();

  allCharacters: any[] = []; // Todos los personajes cargados desde la API
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
  dataSource = new MatTableDataSource<any>([]);
  speciesCount: { key: string; value: number }[] = [];
  totalCharacters = 0; // Total de personajes
  pageSize = 5; // Tamaño de página

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtros reactivos
  private nameFilter$ = new BehaviorSubject<string>('');
  private speciesFilter$ = new BehaviorSubject<string>('');
  private pageIndex$ = new BehaviorSubject<number>(0);

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    // Cargar todos los personajes al inicio
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters) => {
        this.allCharacters = characters; // Almacenar todos los personajes
        this.totalCharacters = characters.length; // Total de personajes
        this.setupReactiveFlow(); // Configurar flujo reactivo para filtros y paginación
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupReactiveFlow(): void {
    // Combinar filtros y paginación en un único flujo reactivo
    combineLatest([this.nameFilter$, this.speciesFilter$, this.pageIndex$])
      .pipe(
        debounceTime(300),
        map(([nameFilter, speciesFilter, pageIndex]) => {
          // Aplicar filtros globales
          const filtered = this.allCharacters.filter((character) => {
            const matchesName = nameFilter ? character.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
            const matchesSpecies = speciesFilter ? character.species.toLowerCase().includes(speciesFilter.toLowerCase()) : true;
            return matchesName && matchesSpecies;
          });

          // Configurar paginación después de aplicar filtros
          this.totalCharacters = filtered.length; // Actualizar total para el paginador
          const start = pageIndex * this.pageSize;
          const end = start + this.pageSize;

          return filtered.slice(start, end); // Personajes visibles
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((displayedCharacters) => {
        this.dataSource.data = displayedCharacters; // Actualizar la tabla
        this.calculateTotals(); // Actualizar totales
      });
  }

  // Métodos para actualizar filtros y paginación
  applyNameFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nameFilter$.next(input.value);
  }

  applySpeciesFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.speciesFilter$.next(input.value);
  }

  onPageChange(event: any): void {
    this.pageIndex$.next(event.pageIndex);
  }

  marcarFavorito(character: any): void {
    this.favoriteCharacter = character;
    this.favoriteSelected.emit(character);
  }

  esFavorito(character: any): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  verDetalles(character: any): void {
    this.characterSelected.emit(character);
  }

  private calculateTotals(): void {
    const speciesMap = this.dataSource.data.reduce((acc: any, character: any) => {
      acc[character.species] = (acc[character.species] || 0) + 1;
      return acc;
    }, {});
    this.speciesCount = Object.entries(speciesMap).map(([key, value]) => ({
      key,
      value: value as number,
    }));
  }
}
