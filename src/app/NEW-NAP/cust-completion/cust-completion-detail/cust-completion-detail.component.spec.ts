import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCompletionDetailComponent } from './cust-completion-detail.component';

describe('CustCompletionDetailComponent', () => {
  let component: CustCompletionDetailComponent;
  let fixture: ComponentFixture<CustCompletionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustCompletionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCompletionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
