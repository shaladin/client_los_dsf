import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingPagingComponent } from './prod-offering-paging.component';

describe('ProdOfferingPagingComponent', () => {
  let component: ProdOfferingPagingComponent;
  let fixture: ComponentFixture<ProdOfferingPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
