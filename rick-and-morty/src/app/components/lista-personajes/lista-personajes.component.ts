import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatHeaderCell, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DatePipe, NgIf, CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
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
    ReactiveFormsModule
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
  dataSource = new MatTableDataSource<any>([]);
  speciesCount = 0; // Total de especies
  typeCount = 0; // Total de tipos
  totalCharacters = 0;
  pageSize = 5;
  genders: string[] = []; // Lista de géneros disponibles
  statuses: string[] = ['Alive', 'Dead', 'unknown']; // Lista de estados disponibles

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchName = new FormControl('');
  searchSpecies = new FormControl('');
  searchStatus = new FormControl('');
  searchGender = new FormControl('');

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getAllCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters) => {
        this.dataSource.data = characters;
        this.totalCharacters = characters.length;
        this.calculateTotals();
        this.calculateGenders(characters);
      });

    this.dataSource.filterPredicate = (data, filter) => {
      const [name, species, status, gender] = filter.split('$');
      return (!name || data.name.toLowerCase().includes(name.toLowerCase())) &&
             (!species || data.species.toLowerCase().includes(species.toLowerCase())) &&
             (!status || data.status.toLowerCase().includes(status.toLowerCase())) &&
             (!gender || data.gender === gender);
    };

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
    this.dataSource.filter = `${this.searchName.value || ''}$${this.searchSpecies.value || ''}$${this.searchStatus.value || ''}$${this.searchGender.value || ''}`;
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

  private calculateGenders(characters: any[]): void {
    this.genders = [...new Set(characters.map(character => character.gender))];
    if (!this.genders.length) {
      console.log('No se encontraron géneros.');
    }
  }
}
