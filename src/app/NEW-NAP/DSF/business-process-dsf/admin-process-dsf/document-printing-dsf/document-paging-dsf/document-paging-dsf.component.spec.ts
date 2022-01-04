import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPagingDsfComponent } from './document-paging-dsf.component';

describe('DocumentPagingDsfComponent', () => {
  let component: DocumentPagingDsfComponent;
  let fixture: ComponentFixture<DocumentPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
