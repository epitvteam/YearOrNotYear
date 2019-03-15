import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  closeResult: string;

  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router) {
  }
  title = 'YearOrNotYear';

  loginUser(event) {
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;

    this.auth.getUsersDetails(username, password).subscribe(data => {
      if (data.success) {
        this.router.navigate(['dashboard']);
        this.auth.setLoggedIn(true);
      } else {
        window.alert(data.message);
      }
    });
    console.log(username, password);
  }

  RegisterUser(event) {
    event.preventDefault();
    const target = event.target;
    const errors = [];
    const username = target.querySelector('#Rusername').value;
    const password = target.querySelector('#Rpassword').value;
    const cpassword = target.querySelector('#Rcpassword').value;

    if (password != cpassword) {
      errors.push('Passswords do not match');
    }
    if (errors.length === 0) {
      this.auth.registerUser(username, password).subscribe(data => {
        console.log(data);
        if (data.success) {
          this.router.navigate(['dashboard']);
        }
      });
    }
    console.log(username, password);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
