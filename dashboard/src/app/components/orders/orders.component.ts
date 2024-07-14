import { Component, OnInit } from '@angular/core';
import { ReceiptService } from '../../service/receipt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})

export class OrdersComponent implements OnInit {
  receipts: any[] = [];
  totalPrice: number = 0;
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sort direction
  sortField: 'date' | 'totalPrice' = 'date'; // Default sort field

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.getAllReceipts();
  }

  getAllReceipts(): void {
    this.receiptService.getAllReceipts().subscribe(
      async (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.receipts = await Promise.all(
            response.data.map(async (receipt: any) => {
              try {
                const userResponse = await this.receiptService.getUserById(receipt.userId._id).toPromise();
                const user = userResponse.data;
                receipt.userName = `${user.firstName} ${user.lastName}`;
              } catch (error) {
                receipt.userName = 'Unknown User';
                console.error('Error fetching user details:', error);
              }

              receipt.productList = await Promise.all(
                receipt.productList.map(async (product: any) => {
                  try {
                    const productDetails = await this.receiptService.getProductById(product.productId._id).toPromise();
                    product.productName = productDetails.data.productName;
                  } catch (error) {
                    product.productName = 'Unknown Product';
                    console.error('Error fetching product details:', error);
                  }
                  return product;
                })
              );

              return receipt;
            })
          );
          this.calculateTotalPrice();
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching receipts', error);
      }
    );
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.receipts.reduce((sum, receipt) => sum + receipt.totalPrice, 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
  }

  sortReceiptsBy(field: 'date' | 'totalPrice'): void {
    this.sortField = field;
    this.receipts.sort((a, b) => {
      const valueA = field === 'date' ? new Date(a.createdAt).getTime() : a.totalPrice;
      const valueB = field === 'date' ? new Date(b.createdAt).getTime() : b.totalPrice;
      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  getSortIcon(field: 'date' | 'totalPrice'): string {
    return this.sortField === field ? (this.sortDirection === 'asc' ? '↑' : '↓') : '';
  }

  confirmDelete(receiptId: string): void {
    const confirmation = confirm('Are you sure you want to delete this receipt?');
    if (confirmation) {
      this.deleteReceipt(receiptId);
    }
  }

  deleteReceipt(receiptId: string): void {
    console.log('Delete receipt', receiptId);
    // Implement your delete logic here
    this.receiptService.deleteReceipt(receiptId).subscribe(
      () => {
        this.receipts = this.receipts.filter(receipt => receipt._id !== receiptId);
        this.calculateTotalPrice();
      },
      (error: any) => {
        console.error('Error deleting receipt', error);
      }
    );
  }
}