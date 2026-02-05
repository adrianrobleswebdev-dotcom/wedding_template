import { Component, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  // Target date for the wedding (Setting it to a future date for the demo)
  targetDate = new Date('2025-10-15T16:00:00');
  
  // Signals for countdown
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  
  private timerInterval: any;

  // RSVP Form
  rsvpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    attending: new FormControl('accept', [Validators.required]),
    guests: new FormControl('1')
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  ngOnInit() {
    this.updateTimer();
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  updateTimer() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      // Date passed
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      return;
    }

    this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmitRsvp() {
    if (this.rsvpForm.valid) {
      this.isSubmitting.set(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('RSVP Submitted:', this.rsvpForm.value);
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.rsvpForm.reset({ attending: 'accept', guests: '1' });
        
        // Hide success message after a few seconds
        setTimeout(() => this.submitSuccess.set(false), 5000);
      }, 1500);
    } else {
      this.rsvpForm.markAllAsTouched();
    }
  }
}