import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Subject,BehaviorSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private nameFilter$ = new BehaviorSubject<string>('');
  private speciesFilter$ = new BehaviorSubject<string>('');

  @Input() favoriteCharacter: any = null;
  @Output() favoriteSelected = new EventEmitter<any>();
  @Output() characterSelected = new EventEmitter<any>();

  characters: any[] = [];
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    // Carga inicial de personajes
    this.rickAndMortyService.getCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.characters = response;
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 5;
        this.calculateTotals();
        this.setupFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilters(): void {
    // Filtro por nombre
    this.nameFilter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((name) => {
        this.applyFilters(); // Aplica todos los filtros activos
      });

    // Filtro por especie
    this.speciesFilter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((species) => {
        this.applyFilters(); // Aplica todos los filtros activos
      });
  }

  applyFilters(): void {
    // Obtiene los valores actuales de los filtros
    const nameFilter = this.nameFilter$.getValue() || '';
    const speciesFilter = this.speciesFilter$.getValue() || '';

    // Filtra los datos
    this.dataSource.data = this.characters.filter((character) => {
      const matchesName = nameFilter
        ? character.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true; // Si el filtro está vacío, no afecta
      const matchesSpecies = speciesFilter
        ? character.species.toLowerCase().includes(speciesFilter.toLowerCase())
        : true; // Si el filtro está vacío, no afecta

      return matchesName && matchesSpecies; // Devuelve true solo si ambos coinciden
    });

    // Recalcula los totales basados en los datos filtrados
    this.calculateTotals();
  }

  applyNameFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nameFilter$.next(input.value);
  }

  applySpeciesFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.speciesFilter$.next(input.value); 
  }

  // Marcar personaje como favorito
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

  calculateTotals(): void {
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
