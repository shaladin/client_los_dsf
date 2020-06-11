import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralAddEditSingleComponent } from './collateral-add-edit-single.component';

describe('CollateralAddEditSingleComponent', () => {
  let component: CollateralAddEditSingleComponent;
  let fixture: ComponentFixture<CollateralAddEditSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralAddEditSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralAddEditSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
