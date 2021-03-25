import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingApvDetailComponent } from './prod-offering-apv-detail.component';

describe('ProdOfferingApvDetailComponent', () => {
  let component: ProdOfferingApvDetailComponent;
  let fixture: ComponentFixture<ProdOfferingApvDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingApvDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingApvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
