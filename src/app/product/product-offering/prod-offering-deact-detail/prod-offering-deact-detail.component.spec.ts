import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingDeactDetailComponent } from './prod-offering-deact-detail.component';

describe('ProdOfferingDeactDetailComponent', () => {
  let component: ProdOfferingDeactDetailComponent;
  let fixture: ComponentFixture<ProdOfferingDeactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingDeactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingDeactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
