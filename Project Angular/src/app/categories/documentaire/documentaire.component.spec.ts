import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentaireComponent } from './documentaire.component';

describe('DocumentaireComponent', () => {
  let component: DocumentaireComponent;
  let fixture: ComponentFixture<DocumentaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
