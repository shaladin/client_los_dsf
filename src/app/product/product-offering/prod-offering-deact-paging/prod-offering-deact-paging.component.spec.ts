import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingDeactPagingComponent } from './prod-offering-deact-paging.component';

describe('ProdOfferingDeactPagingComponent', () => {
  let component: ProdOfferingDeactPagingComponent;
  let fixture: ComponentFixture<ProdOfferingDeactPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingDeactPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingDeactPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
