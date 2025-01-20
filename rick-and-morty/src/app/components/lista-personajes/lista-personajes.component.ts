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
  speciesCount = 0; // Total de especies
  typeCount = 0; // Total de tipos
  totalCharacters = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters) => {
        this.dataSource.data = characters;
        this.totalCharacters = characters.length;
        this.calculateTotals();
      });

    this.dataSource.filterPredicate = (data, filter) => {
      const [name, species] = filter.split('$');
      return (!name || data.name.toLowerCase().includes(name.toLowerCase())) &&
             (!species || data.species.toLowerCase().includes(species.toLowerCase()));
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

  applyNameFilter(event: Event): void {
    this.updateFilter((event.target as HTMLInputElement).value, this.speciesFilter);
  }

  applySpeciesFilter(event: Event): void {
    this.updateFilter(this.nameFilter, (event.target as HTMLInputElement).value);
  }

  private nameFilter = '';
  private speciesFilter = '';

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
    const speciesSet = new Set(this.dataSource.data.map(character => character.species));
    const typeSet = new Set(this.dataSource.data.map(character => character.type));
    this.speciesCount = speciesSet.size;
    this.typeCount = typeSet.size;
  }
}
