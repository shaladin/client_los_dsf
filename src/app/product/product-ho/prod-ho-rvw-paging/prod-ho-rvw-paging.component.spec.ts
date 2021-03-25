import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoRvwPagingComponent } from './prod-ho-rvw-paging.component';

describe('ProdHoRvwPagingComponent', () => {
  let component: ProdHoRvwPagingComponent;
  let fixture: ComponentFixture<ProdHoRvwPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoRvwPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoRvwPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
