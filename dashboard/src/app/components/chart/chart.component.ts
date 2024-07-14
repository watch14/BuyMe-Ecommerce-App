import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReceiptService } from '../../service/receipt.service';
import { ChartConfiguration, ChartType } from 'chart.js';


interface Product {
  productId: { _id: string };
  quantity: number;
  price: number;
  productName?: string;
}

interface Receipt {
  _id: string;
  userId: { _id: string };
  productList: Product[];
  totalPrice: number;
  createdAt: string;
  userName?: string;
}

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  receipts: Receipt[] = [];
  salesChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Sales',
        backgroundColor: 'rgba(20, 184, 166, 0.5)',
        borderColor: '#14B8A6',
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Curved lines
      },
      {
        data: [],
        label: 'Total Products Sold',
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: '#D1D5DB',
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Curved lines
      }
    ],
    labels: []
  };
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827' // Set the font color here
        }
      },
      title: {
        display: true,
        text: 'Sales and Products Sold by Date',
        font: {
          family: 'Arial, sans-serif', // Set the font family here
          size: 18,
        },
        color: '#111827' // Set the title color here
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#14B8A6',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#111827',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827' // Set the title color here
        },
        ticks: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827', // Set the tick color here
        },
        grid: {
          color: '#D1D5DB' // Set the grid line color here
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Amount',
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827' // Set the title color here
        },
        ticks: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827', // Set the tick color here
        },
        grid: {
          color: '#D1D5DB' // Set the grid line color here
        }
      }
    }
  };
  salesChartType: ChartType = 'line';

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.getAllReceipts();
  }

  getAllReceipts(): void {
    this.receiptService.getAllReceipts().subscribe(
      async (response: ApiResponse<Receipt[]>) => {
        if (response.success && Array.isArray(response.data)) {
          this.receipts = await Promise.all(
            response.data.map(async (receipt: Receipt) => {
              try {
                const userResponse = await this.receiptService.getUserById(receipt.userId._id).toPromise();
                const user = userResponse.data;
                receipt.userName = `${user.firstName} ${user.lastName}`;
              } catch (error) {
                receipt.userName = 'Unknown User';
                console.error('Error fetching user details:', error);
              }

              receipt.productList = await Promise.all(
                receipt.productList.map(async (product: Product) => {
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
          this.prepareSalesChartData();
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching receipts', error);
      }
    );
  }

  prepareSalesChartData(): void {
    const salesData = this.receipts.reduce((acc, receipt) => {
      const date = new Date(receipt.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { totalSales: 0, totalProducts: 0 };
      }
      acc[date].totalSales += receipt.totalPrice;
      acc[date].totalProducts += receipt.productList.reduce((sum, product) => sum + product.quantity, 0);
      return acc;
    }, {} as Record<string, { totalSales: number; totalProducts: number }>);

    const sortedDates = Object.keys(salesData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.salesChartData.labels = sortedDates;
    this.salesChartData.datasets[0].data = sortedDates.map(date => salesData[date].totalSales);
    this.salesChartData.datasets[1].data = sortedDates.map(date => salesData[date].totalProducts);
  }

  calculateTotalSales(): number {
    return this.receipts.reduce((total, receipt) => total + receipt.totalPrice, 0);
  }
}