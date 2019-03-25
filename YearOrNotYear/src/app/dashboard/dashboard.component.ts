import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  public closeResult;
  public items;
  public itemsHave;
  public calcul = 0;
  public cred = 0;
  public description = 'NULL';
  email = 'Loading email';
  firstName = 'Loading firstName';
  lastName = 'Loading lastName';
  year = 'Loading year';
  moduleSync = [];

  constructor(private http: HttpClient, private modalService: NgbModal, private user: UserService,
              private router: Router, private auth: AuthService) {
    this.getModulesSubscribed('auth-92a5d79d3a8c4919f312b9caeeccac8eabfff492');
    this.getModulesNotSubscribed('auth-92a5d79d3a8c4919f312b9caeeccac8eabfff492');
  }

  createModule(event) {
    event.preventDefault();
    const target = event.target;
    const errors = [];
    const nameModule = target.querySelector('#nameModule').value;
    const cred = target.querySelector('#cred').value;

    if (errors.length === 0) {
      this.auth.createModule(nameModule, cred).subscribe(data => {
        console.log(data);
        if (data.success) {
          console.log('Module set in DB');
        }
      });
      this.getModulesSubscribed('auth-92a5d79d3a8c4919f312b9caeeccac8eabfff492');
      this.getModulesNotSubscribed('auth-92a5d79d3a8c4919f312b9caeeccac8eabfff492');
    }
  }

  ngOnInit(): void {
    this.user.getData().subscribe(data => {
      if (data.status) {
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.year = data.year;
        this.moduleSync = data.modulesAdd;
        console.log(this.moduleSync);
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
      this.get_credit();
      this.calculGradient();
      this.get_Descri();
    }
  }

  open(content, data) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.cred = data.credits;
    this.description = data.description;
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

  addmin_cred_counter(param) {
    if (param == "+")
      this.cred++;
    if (param == "-")
      if (this.cred > 0)
        this.cred--;
  }

  ret_cred_counter() {
    console.log(this.cred);
  }

  get_csv() {
    var data = [
      {
        name: "Constant LOUBIER",
        age: 19,
        Credit: 80,
        description: "I am London"
      },
      {
        name: "Pierre HERMAN",
        age: 19,
        Credit: 80,
        description: "I am Dublin"
      },
      {
        name: "Hugo CASTELLI",
        age: 19,
        Credit: 80,
        description: "I am Paris"
      },
    ];

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: false,
      headers: ["Name", "Age", "Credit", "Description"]
    };

    new Angular5Csv(data, 'MyFileName', options);
  }

  get_credit() {
    this.calcul = 0;
    for (let loop of this.itemsHave) {
      this.calcul += Number(loop.credits);
    }
  }

  get_Descri() {
  }

  getInfos(autologin) {
    let baseUrl = 'http://intra.epitech.eu/' + autologin + '/user/?format=json';
    this.http.get<any>(baseUrl)
      .subscribe(data => {
        let loginUser = data.login;
        let firstnameUser = data.firstname;
        let lastnameUser = data.lastname;
        var jsonRtn = {'login': loginUser, 'firstname': firstnameUser, 'lastname': lastnameUser};
      });
  }

  async getDescription(autologin, modulecode, year, city) {
    const URLb = 'http://intra.epitech.eu/' + autologin + '/module/' + year + '/' + modulecode + '/' + city + '/?format=json';
    return (await this.http.get(URLb).toPromise());
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
        JsonInArray = {
          'name': entry.title,
          'scolaryear': entry.scolaryear,
          'description': descriptions.description,
          'credits': entry.credits,
          'status': entry.status
        };
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.itemsHave = returnArray;
    this.get_credit();
    this.calculGradient();
    return (returnArray);
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
        JsonInArray = {
          'name': entry.title, 'scolaryear': entry.scolaryear, 'description': descriptions.description,
          'credits': entry.credits, 'status': entry.status
        };
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.items = returnArray;
    return (returnArray);
  }

  calculGradient() {
    const element: HTMLElement = document.getElementById('gradient');

    if (this.calcul <= 40 && this.calcul > 0) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, red, white, white)');
    } else if (this.calcul < 60 && this.calcul > 40) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, orange, white)');
    } else if (this.calcul >= 60 && this.calcul < 75) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, green, green, green, green, white)');
    } else if (this.calcul <= 0) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, grey, lightgrey)');
    } else if (this.calcul >= 75) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, red, yellow, purple, blue, green)');
    }
  }

  clear() {
    this.items = this.items.concat(this.itemsHave);
    this.itemsHave = [];
    this.get_credit();
    this.calculGradient();
  }

  async reload() {
    let img = document.querySelector('.gifimg');
    img.setAttribute('src', 'assets/images/chargement.gif');
    img.setAttribute('style', 'width: 30px');
    await this.getModulesSubscribed('auth-f6f274a14de80a2343e2c9b75186a460dbc236c5');
    this.getModulesNotSubscribed('auth-f6f274a14de80a2343e2c9b75186a460dbc236c5');
    img.setAttribute('src', '');
    img.setAttribute('style', '');
  }

}
