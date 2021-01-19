import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwLegalDocComponent } from './crd-rvw-legal-doc.component';

describe('CrdRvwLegalDocComponent', () => {
  let component: CrdRvwLegalDocComponent;
  let fixture: ComponentFixture<CrdRvwLegalDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwLegalDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwLegalDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
