import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSellingGridComponent } from './top-selling-grid.component';

describe('TopSellingGridComponent', () => {
  let component: TopSellingGridComponent;
  let fixture: ComponentFixture<TopSellingGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSellingGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSellingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
