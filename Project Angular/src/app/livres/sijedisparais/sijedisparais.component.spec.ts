import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SijedisparaisComponent } from './sijedisparais.component';

describe('SijedisparaisComponent', () => {
  let component: SijedisparaisComponent;
  let fixture: ComponentFixture<SijedisparaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SijedisparaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SijedisparaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
