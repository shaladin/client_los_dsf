import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralFctrComponent } from './collateral-fctr.component';

describe('CollateralFctrComponent', () => {
  let component: CollateralFctrComponent;
  let fixture: ComponentFixture<CollateralFctrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralFctrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralFctrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
