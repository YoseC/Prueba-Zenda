import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lista-personajes',
  templateUrl: './lista-personajes.component.html',
  styleUrls: ['./lista-personajes.component.css'],
})
export class ListaPersonajesComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

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
  dataSource = new MatTableDataSource<any>([]);
  speciesCount: { key: string; value: number }[] = [];
  totalCharacters = 0; // Total de personajes
  pageSize = 5; // Tamaño de página

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    // Cargar todos los personajes al inicio
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters) => {
        this.dataSource.data = characters; // Asignar datos a la tabla
        this.totalCharacters = characters.length; // Total de personajes
        this.calculateTotals(); // Calcular totales
      });

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filters = filter.split('$');
      const matchesName = filters[0] ? data.name.toLowerCase().includes(filters[0].toLowerCase()) : true;
      const matchesSpecies = filters[1] ? data.species.toLowerCase().includes(filters[1].toLowerCase()) : true;
      return matchesName && matchesSpecies;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos para actualizar filtros
  applyNameFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateFilter(input.value, this.speciesFilter);
  }

  applySpeciesFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateFilter(this.nameFilter, input.value);
  }

  private nameFilter: string = '';
  private speciesFilter: string = '';

  private updateFilter(nameFilter: string, speciesFilter: string): void {
    this.nameFilter = nameFilter;
    this.speciesFilter = speciesFilter;
    this.dataSource.filter = `${nameFilter}$${speciesFilter}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
