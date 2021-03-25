import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoDeactPagingComponent } from './prod-ho-deact-paging.component';

describe('ProdHoDeactPagingComponent', () => {
  let component: ProdHoDeactPagingComponent;
  let fixture: ComponentFixture<ProdHoDeactPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoDeactPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoDeactPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
