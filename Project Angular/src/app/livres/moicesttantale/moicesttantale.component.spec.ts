import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoicesttantaleComponent } from './moicesttantale.component';

describe('MoicesttantaleComponent', () => {
  let component: MoicesttantaleComponent;
  let fixture: ComponentFixture<MoicesttantaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoicesttantaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoicesttantaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
