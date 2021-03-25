import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingApvPagingComponent } from './prod-offering-apv-paging.component';

describe('ProdOfferingApvPagingComponent', () => {
  let component: ProdOfferingApvPagingComponent;
  let fixture: ComponentFixture<ProdOfferingApvPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingApvPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingApvPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
