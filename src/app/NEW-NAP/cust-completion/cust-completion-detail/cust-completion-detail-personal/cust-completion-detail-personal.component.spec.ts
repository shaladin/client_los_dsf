import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCompletionDetailPersonalComponent } from './cust-completion-detail-personal.component';

describe('CustCompletionDetailPersonalComponent', () => {
  let component: CustCompletionDetailPersonalComponent;
  let fixture: ComponentFixture<CustCompletionDetailPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustCompletionDetailPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCompletionDetailPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
