import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoesieComponent } from './poesie.component';

describe('PoesieComponent', () => {
  let component: PoesieComponent;
  let fixture: ComponentFixture<PoesieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoesieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoesieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
