import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  message = ''; // ✅ Add message variable

  constructor(private authService: AuthService) {}

  async login() {
    this.message = ''; // Clear previous message

    if (!this.email || !this.password) {
      this.message = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      this.message = err.message || 'حدث خطأ أثناء تسجيل الدخول.';
    }
  }
}
