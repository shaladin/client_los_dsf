import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwCreditScoringComponent } from './crd-rvw-credit-scoring.component';

describe('CrdRvwCreditScoringComponent', () => {
  let component: CrdRvwCreditScoringComponent;
  let fixture: ComponentFixture<CrdRvwCreditScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwCreditScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwCreditScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
