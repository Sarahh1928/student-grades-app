import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService) {}

  signup() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      
      return;
    }

    if (this.password !== this.confirmPassword) {
      return;
    }

    this.authService.signup(this.email, this.password, this.fullName).catch(err => {
      
    });
  }
}
