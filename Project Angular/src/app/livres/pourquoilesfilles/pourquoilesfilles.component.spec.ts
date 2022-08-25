import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourquoilesfillesComponent } from './pourquoilesfilles.component';

describe('PourquoilesfillesComponent', () => {
  let component: PourquoilesfillesComponent;
  let fixture: ComponentFixture<PourquoilesfillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PourquoilesfillesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PourquoilesfillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
