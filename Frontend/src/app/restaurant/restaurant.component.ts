import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { AuthService } from '../auth.service';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  userId = localStorage.getItem('userId');
  type = localStorage.getItem('type');
  userName = localStorage.getItem('userName');
  errorMessage = '';
  userRequests: any[] = [];

  newRequest: any = { Userid: this.userId, RestaurantId: '', description: '', position: '' };
  restaurants: any[] = [];
  applyFormVisible = false;

  constructor(public authService: AuthService, private requestService: RequestService, private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.getAll();
    this.getUserRequests();
  }

  getUserRequests(): void {
    if (this.userId) {
      this.requestService.getAllUsersRequests(this.userId).subscribe(
        (data) => {
          this.userRequests = data;
        },
        (error) => {
          console.error('Error fetching user requests:', error);
        }
      );
    }
  }

  getAll(): void {
    this.restaurantService.getAll().subscribe(
      (data) => {
        console.log('Restaurants Data:', data);
        this.restaurants = data;
      },
      (error) => console.error('Error fetching restaurants:', error)
    );
  }

  toggleApplyForm(res: any): void {
    this.applyFormVisible = !this.applyFormVisible;
    this.newRequest.RestaurantId = this.applyFormVisible ? res : null;
  }

  cancelApply(): void {
    this.applyFormVisible = false;
    this.newRequest = { Userid: '', RestaurantId: '', description: '', position: '' };
  }

  isAlreadyApplied(restaurantId: string): boolean {
    return this.userRequests.some(req => req.request.RestaurantId === restaurantId);
  }

  Update(): void {
    if (confirm('Are you sure you want to update this recipe?')) {

      this.requestService.add(this.newRequest).subscribe(
        (response) => {
          console.log('Application Response:', response);
          this.cancelApply();
          this.getUserRequests();
          alert('Application submitted successfully!');
        },
        (error) => {
          console.error('Error submitting application:', error);
          alert('Failed to submit application.');
        }
      );
    }
  }

}
