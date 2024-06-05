import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouReturnPagingDsfComponent } from './change-mou-return-paging-dsf.component';

describe('ChangeMouReturnPagingDsfComponent', () => {
  let component: ChangeMouReturnPagingDsfComponent;
  let fixture: ComponentFixture<ChangeMouReturnPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouReturnPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouReturnPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
