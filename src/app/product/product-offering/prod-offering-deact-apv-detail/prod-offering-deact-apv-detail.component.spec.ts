import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingDeactApvDetailComponent } from './prod-offering-deact-apv-detail.component';

describe('ProdOfferingDeactApvDetailComponent', () => {
  let component: ProdOfferingDeactApvDetailComponent;
  let fixture: ComponentFixture<ProdOfferingDeactApvDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingDeactApvDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingDeactApvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
