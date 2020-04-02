import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSingerPagingComponent } from './doc-singer-paging.component';

describe('DocSingerPagingComponent', () => {
  let component: DocSingerPagingComponent;
  let fixture: ComponentFixture<DocSingerPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSingerPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSingerPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
