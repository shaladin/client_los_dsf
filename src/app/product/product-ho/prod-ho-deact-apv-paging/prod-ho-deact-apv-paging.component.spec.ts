import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoDeactApvPagingComponent } from './prod-ho-deact-apv-paging.component';

describe('ProdHoDeactApvPagingComponent', () => {
  let component: ProdHoDeactApvPagingComponent;
  let fixture: ComponentFixture<ProdHoDeactApvPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoDeactApvPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoDeactApvPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
