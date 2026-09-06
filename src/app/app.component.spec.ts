import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AisuiteTstoolsModule } from 'aisuite-ngtools';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // AppComponent's template tree pulls in LanguageService (via the `localise`
        // pipe); stand in for the real app.config.ts wiring with test-only values.
        importProvidersFrom(AisuiteTstoolsModule.forRoot({ opLingua: 'en', uiLanguageJS: [], linsceApiUrl: '' }))
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
