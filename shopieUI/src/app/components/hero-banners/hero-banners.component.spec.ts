import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroBannersComponent } from './hero-banners.component';

describe('HeroBannersComponent', () => {
  let component: HeroBannersComponent;
  let fixture: ComponentFixture<HeroBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBannersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
