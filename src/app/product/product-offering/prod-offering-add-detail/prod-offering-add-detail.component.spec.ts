import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingAddDetailComponent } from './prod-offering-add-detail.component';

describe('ProdOfferingAddDetailComponent', () => {
  let component: ProdOfferingAddDetailComponent;
  let fixture: ComponentFixture<ProdOfferingAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
