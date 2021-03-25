import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingRvwPagingComponent } from './prod-offering-rvw-paging.component';

describe('ProdOfferingRvwPagingComponent', () => {
  let component: ProdOfferingRvwPagingComponent;
  let fixture: ComponentFixture<ProdOfferingRvwPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingRvwPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingRvwPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
