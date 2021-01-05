import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCompletionPagingComponent } from './cust-completion-paging.component';

describe('CustCompletionPagingComponent', () => {
  let component: CustCompletionPagingComponent;
  let fixture: ComponentFixture<CustCompletionPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustCompletionPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCompletionPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
