import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingReturnPagingComponent } from './prod-offering-return-paging.component';

describe('ProdOfferingReturnPagingComponent', () => {
  let component: ProdOfferingReturnPagingComponent;
  let fixture: ComponentFixture<ProdOfferingReturnPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingReturnPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingReturnPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
