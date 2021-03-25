import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoPagingComponent } from './prod-ho-paging.component';

describe('ProdHoPagingComponent', () => {
  let component: ProdHoPagingComponent;
  let fixture: ComponentFixture<ProdHoPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
