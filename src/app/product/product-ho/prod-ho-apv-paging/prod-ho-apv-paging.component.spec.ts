import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoApvPagingComponent } from './prod-ho-apv-paging.component';

describe('ProdHoApvPagingComponent', () => {
  let component: ProdHoApvPagingComponent;
  let fixture: ComponentFixture<ProdHoApvPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoApvPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoApvPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
