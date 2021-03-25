import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingDeactApvPagingComponent } from './prod-offering-deact-apv-paging.component';

describe('ProdOfferingDeactApvPagingComponent', () => {
  let component: ProdOfferingDeactApvPagingComponent;
  let fixture: ComponentFixture<ProdOfferingDeactApvPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingDeactApvPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingDeactApvPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
