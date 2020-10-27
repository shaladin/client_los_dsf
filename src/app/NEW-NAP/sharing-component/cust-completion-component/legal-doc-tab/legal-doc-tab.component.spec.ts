import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocTabComponent } from './legal-doc-tab.component';

describe('LegalDocTabComponent', () => {
  let component: LegalDocTabComponent;
  let fixture: ComponentFixture<LegalDocTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalDocTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDocTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
