import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../core/service/auth'; // Import your Auth Service
import { Common } from '../../core/common/common';

declare var Razorpay: any;

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss'
})
export class Pricing {
  private http = inject(HttpClient);
  protected router = inject(Router);
  protected auth = inject(Auth); // Inject Auth
  protected common = inject(Common); // Inject Auth

  private apiUrl = 'http://localhost:8080/api/payment';

  upgradeToPro() {
    this.common.showMessage('error', 'Error', 'Please contact us at quizlynxapp@gmail.com for upgrade.');
    return;
    if (!this.auth.isLoggedIn$.value) {
      this.common.showMessage('error', 'Error', 'Please log in to upgrade your plan.');
      this.router.navigate(['/signin']);
      return;
    }
    this.createOrder();
  }

  createOrder() {
    this.http.post(`${this.apiUrl}/create-order`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.openPaymentModal(res);
      },
      error: (err) => {
        console.error('Order creation failed', err);
        this.common.showMessage('error', 'Error', 'Could not initiate payment. Please try again.');
      }
    });
  }

  openPaymentModal(orderData: any) {
    const currentUser = this.auth.getCachedUser();
    const userEmail = currentUser?.email || '';

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Quizlynx Pro',
      description: 'Upgrade to Premium Membership',
      order_id: orderData.orderId,

      handler: (response: any) => {
        this.verifyPayment(response);
      },
      prefill: {
        name: currentUser?.username || '',
        email: userEmail,
      },

      theme: {
        color: '#6366f1'
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', function (response: any) {
      alert("Payment Failed: " + response.error.description);
    });
  }

  verifyPayment(paymentData: any) {
    this.http.post(`${this.apiUrl}/verify`, paymentData, { withCredentials: true }).subscribe({
      next: () => {
        alert('Payment Successful! Welcome to Pro.');
        this.router.navigate(['/user-dashboard']);
      },
      error: () => alert('Payment verification failed.')
    });
  }
}