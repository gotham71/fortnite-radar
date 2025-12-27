import { ComponentFixture, TestBed } from '@angular/core/testing';
import { maps } from './maps';

describe('maps', () => {
  let component: maps;
  let fixture: ComponentFixture<maps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [maps],
    }).compileComponents();

    fixture = TestBed.createComponent(maps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
