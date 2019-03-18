import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  closeResult: string;
  items: string;
  public itemsHave;
  email = 'Loading email';
  firstName = 'Loading firstName';
  lastName = 'Loading lastName';
  year = 'Loading year';

  constructor(private http: HttpClient, private modalService: NgbModal, private user: UserService,
              private router: Router, private auth: AuthService) {
    this.http.get<any>('assets/json/module.json')
      .subscribe(data => {
        this.items = data;
        this.itemsHave = [];
      });
    console.log(this.items);
  }

  createModule(event) {
    event.preventDefault();
    const target = event.target;
    const errors = [];
    const nameModule = target.querySelector('#nameModule').value;
    const cred = target.querySelector('#cred').value;

    if (errors.length === 0) {
      this.auth.postModule(nameModule, cred).subscribe(data => {
        console.log(data);
        if (data.success) {
          console.log('Module set in DB');
        }
      });
    }
    console.log(nameModule, cred);
  }

  ngOnInit(): void {
    this.user.getData().subscribe(data => {
      if (data.status) {
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.year = data.year;
      } else {
        this.router.navigate(['home']);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return `with: ${reason}`;
    }
  }
}
