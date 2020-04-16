import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPagingComponent } from './document-paging.component';

describe('DocumentPagingComponent', () => {
  let component: DocumentPagingComponent;
  let fixture: ComponentFixture<DocumentPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
