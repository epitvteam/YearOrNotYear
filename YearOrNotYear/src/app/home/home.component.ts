import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {selector} from 'rxjs-compat/operator/publish';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  closeResult: string;

  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router) {
  }
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
    const email = target.querySelector('#Remail').value;
    const password = target.querySelector('#Rpassword').value;
    const cpassword = target.querySelector('#Rcpassword').value;
    const firstName = target.querySelector('#RfirstName').value;
    const lastName = target.querySelector('#RlastName').value;
    const year = target.querySelector('#Ryear').value;

    if (password != cpassword) {
      errors.push('Passswords do not match');
      $('#pasid').removeClass('displayn');
    }
    else
      $('#pasid').addClass('displayn');
    if  (password.length < 8 || password.lenght < 8) {
      errors.push('Password is to short');
      $('#err').removeClass('displayn');
    }
    if (password.length >= 8) {
      $('#err').addClass('displayn');
    }
    if (errors.length === 0) {
      this.auth.registerUser(email, password, firstName, lastName, year).subscribe(data => {
        console.log(data);
        if (data.success) {
          this.router.navigate(['dashboard']);
        }
      });
    }
    console.log(email, password, firstName, lastName, year);
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


