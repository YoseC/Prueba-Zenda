import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig
} from '@angular/router';

// agregamos las importaciones de ngrx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { characterReducer } from './state/character.reducer';
import { CharacterEffects } from './state/character.effects';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_TABS_CONFIG } from "@angular/material/tabs";
import { registerLocaleData } from '@angular/common';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import localeEsCL from '@angular/common/locales/es-CL';
import localeEsCLExtra from '@angular/common/locales/extra/es-CL';
import { routes } from './app-routes';

// importamos Apollo Client para GraphQL
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';


registerLocaleData( localeEsCL, 'es-CL', localeEsCLExtra );
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ),
    provideRouter( routes,
      withRouterConfig( {
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always'
      } ),
      withHashLocation(),
      withComponentInputBinding(),
      withPreloading( PreloadAllModules ),
      withInMemoryScrolling( {
        scrollPositionRestoration: 'enabled'
      } )
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom( HttpClientModule ),

     // ✅ Integración de Redux
     provideStore({ characterState: characterReducer }),
     provideEffects([CharacterEffects]) ,

    // ✅ Integración de Apollo Client
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        return new ApolloClient({
          uri: 'https://rickandmortyapi.com/graphql', // 🔹 API de GraphQL
          cache: new InMemoryCache(), // 🔹 Cache en memoria para mejorar rendimiento
          defaultOptions: {
            query: {
              fetchPolicy: 'cache-first', // 🔹 Reduce llamadas innecesarias a la API
              errorPolicy: 'all'
            },
          },
        });
      },
    },

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {
        appearance: 'outline',
        floatLabel: 'always',
        subscriptSizing: 'dynamic',
        hideRequiredMarker: false
      }
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: {
        color: 'primary'
      }
    }, {
      provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
      useValue: {
        color: 'primary'
      }
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {
        color: 'primary'
      }
    },
    {
      provide: MAT_TABS_CONFIG, useValue: {
        preserveContent: true,
        stretchTabs: true
      }
    }
  ]
};

