import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestquoilamourComponent } from './cestquoilamour.component';

describe('CestquoilamourComponent', () => {
  let component: CestquoilamourComponent;
  let fixture: ComponentFixture<CestquoilamourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CestquoilamourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CestquoilamourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
