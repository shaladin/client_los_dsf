import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoReturnPagingComponent } from './prod-ho-return-paging.component';

describe('ProdHoReturnPagingComponent', () => {
  let component: ProdHoReturnPagingComponent;
  let fixture: ComponentFixture<ProdHoReturnPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoReturnPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoReturnPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
