import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHighlightCommentComponent } from './view-highlight-comment.component';

describe('ViewHighlightCommentComponent', () => {
  let component: ViewHighlightCommentComponent;
  let fixture: ComponentFixture<ViewHighlightCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHighlightCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHighlightCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
