import {Component, OnInit} from '@angular/core';
import {HttpClient, JsonpClientBackend} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  public closeResult;
  public items;
  public itemsHave;
  quote = 'Loading quote';
  email = 'Loading email';

  constructor(private http: HttpClient, private modalService: NgbModal, private user: UserService,
              private router: Router) {
    /*this.http.get<any>('assets/json/module.json')
      .subscribe(data => {
        this.items = data;
        this.itemsHave = [];
      });*/
    this.getModulesSubscribed('auth-f6f274a14de80a2343e2c9b75186a460dbc236c5');
    this.getModulesNotSubscribed('auth-f6f274a14de80a2343e2c9b75186a460dbc236c5');
  }

  ngOnInit(): void {
    this.user.getData().subscribe(data => {
      if (data.status) {
        this.quote = data.quote;
        this.email = data.email;
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

  async getDescription(autologin, modulecode, year, city) {
    const URLb = 'http://intra.epitech.eu/' + autologin + '/module/' + year + '/' + modulecode + '/' + city + '/?format=json';
    return(await this.http.get(URLb).toPromise());
  }

  async getModulesSubscribed(autologin) {
    let baseUrl = 'http://intra.epitech.eu/' + autologin + '/course/filter?format=json';
    var returnArray = [];
    var JsonInArray;
    var descriptions;
    var datas = await this.http.get<any>(baseUrl).toPromise();
    for (let entry of datas) {
      //REPLACE 2018 BY YEAR
      if ((entry.status == 'ongoing' || entry.status == 'valid' || entry.status == 'fail') && entry.scolaryear == 2018) {
        descriptions = await this.getDescription(autologin, entry.code, entry.scolaryear, entry.codeinstance);
        JsonInArray = {'name': entry.title, 'scolaryear': entry.scolaryear, 'description': descriptions.description, 'credits': entry.credits, 'status': entry.status};
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.itemsHave = returnArray;
    return(returnArray);
  }

  async getModulesNotSubscribed(autologin) {
    const baseUrl = 'http://intra.epitech.eu/' + autologin + '/course/filter?format=json';
    var returnArray = [];
    var JsonInArray;
    var descriptions;
    var datas = await this.http.get<any>(baseUrl).toPromise();
    if (!datas) {
      console.log('tg');
    }
    for (let entry of datas) {
      //REPLACE 2018 BY YEAR
      if (entry.status == 'notregistered' && entry.scolaryear == 2018) {
        descriptions = await this.getDescription(autologin, entry.code, entry.scolaryear, entry.codeinstance);
        JsonInArray = {'name': entry.title, 'scolaryear': entry.scolaryear, 'description': descriptions.description,
          'credits': entry.credits, 'status': entry.status};
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.items = returnArray;
    return(returnArray);
  }
}
