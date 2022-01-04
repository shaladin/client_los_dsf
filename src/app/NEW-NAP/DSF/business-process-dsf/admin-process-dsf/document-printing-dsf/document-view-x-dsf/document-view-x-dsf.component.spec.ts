import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewXDsfComponent } from './document-view-x-dsf.component';

describe('DocumentViewXDsfComponent', () => {
  let component: DocumentViewXDsfComponent;
  let fixture: ComponentFixture<DocumentViewXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentViewXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
