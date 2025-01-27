import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
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
  items: any[] = [];
  itemsFiltered: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  speciesCount = 0; // Total de especies
  typeCount = 0; // Total de tipos
  totalCharacters = 0;
  pageSize = 200;
  genders: string[] = []; // Lista de géneros disponibles
  statuses: string[] = []; // Lista de estados disponibles

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('');
  searchGender = new FormControl('');


  constructor(private rickAndMortyService: RickAndMortyService, private router: Router, private FavoritosService: FavoritosService ) {}

  ngOnInit(): void {
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters) => {
        this.items = characters;
        this.totalCharacters = characters.length;
        this.updateFilter();
      });

    this.searchName.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.updateFilter())
      )
      .subscribe();

    this.searchSpecies.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.updateFilter())
      )
      .subscribe();

    this.searchStatus.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.updateFilter())
      )
      .subscribe();

    this.searchGender.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.updateFilter())
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFilter(): void {
    const name = this.searchName.value?.toLowerCase() || '';
    const species = this.searchSpecies.value?.toLowerCase() || '';
    const status = this.searchStatus.value || '';
    const gender = this.searchGender.value || '';

    this.itemsFiltered = this.items.filter(character =>
      (!name || character.name.toLowerCase().includes(name)) &&
      (!species || character.species.toLowerCase().includes(species)) &&
      (!status || status === 'todo' || character.status === status) &&
      (!gender || gender === 'todo' || character.gender === gender)
    );

    this.dataSource.data = this.itemsFiltered;
    this.calculateTotals();
    this.calculateGenders(this.itemsFiltered);
    this.calculateStatuses(this.itemsFiltered);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  marcarFavorito(character: any): void {
    this.FavoritosService.setFavorito(character);  // Actualiza en el servicio
    this.favoriteSelected.emit(character);
    character.isFavorite = !character.isFavorite;
  }

  esFavorito(character: any): boolean {
    return this.favoriteCharacter?.id === character.id;
  }

  verDetalles(character: any): void {
    this.characterSelected.emit(character);
    this.router.navigate(['/detalles-personajes', character.id]);
  }

  private calculateTotals(): void {
    const speciesSet = new Set(this.itemsFiltered.map(character => character.species));
    const typeSet = new Set(this.itemsFiltered.map(character => character.type));
    this.speciesCount = speciesSet.size;
    this.typeCount = typeSet.size;
  }

  private calculateUniqueValues(characters: any[], key: string): string[] {
    const uniqueValues = [...new Set(characters.map(character => character[key]))];
    if (!uniqueValues.length) {
      console.log(`No se encontraron valores únicos para ${key}.`);
    }
    return uniqueValues;
  }

  private calculateGenders(characters: any[]): void {
    this.genders = this.calculateUniqueValues(characters, 'gender');
  }

  private calculateStatuses(characters: any[]): void {
    this.statuses = this.calculateUniqueValues(characters, 'status');
  }
}
