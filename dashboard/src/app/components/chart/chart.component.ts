import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReceiptService } from '../../service/receipt.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  receipts: any[] = [];
  salesChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: 'Sales',
      backgroundColor: '#14B8A6',
      borderColor: '#111827',
      borderWidth: 1,
    }],
    labels: []
  };
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
          color: '#111827' // Set the font color here
        }
      }
    },
    scales: {
      x: {
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
  salesChartType: ChartType = 'bar';

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
        acc[date] = 0;
      }
      acc[date] += receipt.totalPrice;
      return acc;
    }, {});

    this.salesChartData.labels = Object.keys(salesData);
    this.salesChartData.datasets[0].data = Object.values(salesData);

    // Debugging output
    console.log('Sales Data:', salesData);
    console.log('Chart Labels:', this.salesChartData.labels);
    console.log('Chart Data:', this.salesChartData.datasets[0].data);
  }
}