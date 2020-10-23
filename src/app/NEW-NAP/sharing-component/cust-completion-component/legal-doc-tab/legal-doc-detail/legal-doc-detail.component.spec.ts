import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocDetailComponent } from './legal-doc-detail.component';

describe('LegalDocDetailComponent', () => {
  let component: LegalDocDetailComponent;
  let fixture: ComponentFixture<LegalDocDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalDocDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
