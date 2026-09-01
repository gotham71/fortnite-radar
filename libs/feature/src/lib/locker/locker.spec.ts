import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Locker } from './locker';

describe('Locker', () => {
  let component: Locker;
  let fixture: ComponentFixture<Locker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Locker],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Locker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
