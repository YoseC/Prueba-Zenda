import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig
} from '@angular/router';

// NgRx: Store y Effects
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { characterReducer } from './state/character.reducer';
import { CharacterEffects } from './state/character.effects';

// HTTP y Apollo GraphQL
import { provideHttpClient } from "@angular/common/http";
import { provideApollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions, NormalizedCacheObject } from '@apollo/client/core';

// Rutas de la aplicación
import { routes } from './app-routes';

// Angular Material - Configuración de UI
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_TABS_CONFIG } from "@angular/material/tabs";
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';

// Configuración regional (Español - Chile)
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import localeEsCLExtra from '@angular/common/locales/extra/es-CL';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(localeEsCL, 'es-CL', localeEsCLExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    // 🚀 Configuración de detección de cambios y enrutamiento
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withRouterConfig({ onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'always' }),
      withHashLocation(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // 🔹 Proveedores de Angular
    provideHttpClient(),
    provideAnimations(),

    // 🟢 NgRx Store & Effects
    provideStore({ characterState: characterReducer }),
    provideEffects([CharacterEffects]),

    // ✅ Configuración correcta de Apollo Angular
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> => ({
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'https://rickandmortyapi.com/graphql' }), // ✅ URL de la API GraphQL
      }),
      deps: [HttpLink]
    },

    // 🎨 Configuración de Angular Material
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {
        appearance: 'outline',
        floatLabel: 'always',
        subscriptSizing: 'dynamic',
        hideRequiredMarker: false
      }
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_TABS_CONFIG, useValue: { preserveContent: true, stretchTabs: true } }
  ]
};
