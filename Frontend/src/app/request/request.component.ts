import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RequestService } from '../request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  type: string | null = localStorage.getItem('type');
  userId: string | null = localStorage.getItem('userId');
  restaurantRequests: any[] = [];
  userRequests: any[] = [];
  showApprovalForm = false;
  approvalForm: any = { Location: '', content: '', date: '' };

  constructor(private authService: AuthService, private requestService: RequestService, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.type === 'restaurant' && this.userId) {
      this.requestService.getAllRestaurantsRequests(this.userId).subscribe(
        (data) => {
          this.restaurantRequests = data;
        },
        (error) => {
          console.error('Error fetching restaurant requests:', error);
        }
      );
    } else if (this.type === 'user' && this.userId) {
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

  toggleApprovalForm(): void {
    this.showApprovalForm = !this.showApprovalForm;
  }

  approveRequest(requestId: string): void {
    const result = this.restaurantRequests.find(x => x.request._id === requestId);
    if (result) {
      const newInterview = {
        Location: this.approvalForm.Location,
        content: this.approvalForm.content,
        date: this.approvalForm.date
      };
      result.request.status = true;
      result.request.interview = newInterview;
      this.requestService.update(result.request).subscribe(
        (response) => {
          console.log('Request approved successfully:', response);
          this.showApprovalForm = false;
          alert('Request approved successfully!');
        },
        (error) => {
          console.error('Error approving request:', error);
        }
      );
    }
  }

}
