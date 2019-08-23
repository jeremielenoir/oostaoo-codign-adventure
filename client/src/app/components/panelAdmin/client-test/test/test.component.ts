import { Component, OnInit, Input } from '@angular/core';
import { ApiClientService, API_URI_CANDIDATS, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public questions: any;
  public index = 0;
  public question: any;
  public timedefault = 0;
  public stopTimeInterval: any;
  public Activetime: boolean;
  public timeDanger: number;
  public type: string;
  public Alltime: number[] = [];
  public CalculTimeTotal = 0;
  @Input() public questionCampaign: any;
  @Input() public technoCampaign: any;
  @Input() public candidat: any;
  public language: string;
  public dateFinishTest: any;
  public responses: Array<string>;
  public responseUser: string;
  public counterCheck = 0; // counter good response
  public counterTotal = 0;
  public arrayReponseUser: any = [];
  public test: boolean;


  constructor(private apiClientService: ApiClientService) { }

  ngOnInit() {
    this.questions = this.questionCampaign;
    this.question = this.questionCampaign[this.index];
    this.timeDanger = this.questionCampaign[0].time - 5;
    this.type = this.questionCampaign[0];
    this.Countertime();
    // console.log('techno id', this.technoCampaign);
    // FIRST QUESTIONS
    if (this.question.content !== null) {
      this.responses = this.question.content.split(', ');
    }
    // console.log('this.responses: ', this.responses);
    // console.log('this.question: ', this.question);
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
  }

  checkCheckBoxvalue(event, response) {
    // console.log('this.checkReponse: ', this.checkReponse);
    const arrayGoodRep = this.question.answer_value.split(', ');
    if (event.source.checked) {
      this.arrayReponseUser.push(response);
      this.arrayReponseUser.sort();
      arrayGoodRep.sort();
      console.log('this.arrayReponseUser.sort(): ', this.arrayReponseUser);
      console.log('arrayGoodRep.sort(): ', arrayGoodRep);
      this.checkLengthAndItemArray(this.arrayReponseUser, arrayGoodRep);
    } else {
      const element = this.arrayReponseUser.find(item => item === response);
      if (element) {
        this.arrayReponseUser.splice(this.arrayReponseUser.indexOf(element), 1);
        this.checkLengthAndItemArray(this.arrayReponseUser, arrayGoodRep);
      }
    }
  }

  checkLengthAndItemArray(arrayUser, arrayReponse) {
    if (arrayUser.length === arrayReponse.length &&
      arrayUser.every((element1, index) =>
        element1 === arrayReponse[index])) {
      console.log('ok');
      console.log('this.arrayReponseUser: ', arrayUser);
      this.test = true;
    } else {
      this.test = false;
    }
  }

  Countertime() {
    this.stopTimeInterval = setInterval(() => {
      if (this.timedefault < this.questions[this.index].time) {
        this.timedefault++;
      } else {
        this.Activetime = !this.Activetime;
        clearInterval(this.stopTimeInterval);
      }
    }, 1000);
  }

  public QuestNext() {
    console.log('this.test: ', this.test);
    // console.log('this.checkReponse: ', this.checkReponse);
    this.counterTotal++; // counter total questions
    // console.log('this.question: ', this.question);
    // console.log('this.responseUser: ', this.responseUser);
    // check reponseUser
    this.Alltime.push(this.timedefault);
    this.Activetime = false;
    if (this.index < this.questions.length - 1) {
      this.index++;
      this.timedefault = 0;
      clearInterval(this.stopTimeInterval);
      this.Countertime();
    } else {
      if (this.index === this.questions.length - 1) {
        this.dateFinishTest = new Date().toISOString();
        // console.log('testdate: ', this.dateFinishTest);
        clearInterval(this.stopTimeInterval);
        for (const nbrtime of this.Alltime) {
          // console.log('chaque temp passe sur chaque question', nbrtime);
          this.CalculTimeTotal += nbrtime;
        }
        // console.log('this.CalculTimeTotal: ', this.CalculTimeTotal);
        this.postTimeTest(this.CalculTimeTotal);
      }
    }
    this.question = this.questions[this.index];
    // NEXT QUESTIONS
    if (this.question.content !== null) {
      this.responses = this.question.content.split(', ');
    } else {
      this.responses = this.question;
    }
    // console.log('this.responses in QUESTNEXT: ', this.responses);
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    this.timeDanger = this.questions[this.index].time - 5;
    // console.log('type ', this.question.type);
    // console.log('COUNTER CHECK: ', this.counterCheck);
    if (this.responseUser === this.question.answer_value ||
      this.question.answer_value.includes(this.responseUser)) {
      console.log('ok');
      this.counterCheck++;
    }
    this.responseUser = '';
    this.arrayReponseUser = [];
    console.log('Ton score est de: ' + this.counterCheck + ' / ' + this.counterTotal);
  }
  public fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }

  postTimeTest(dureeTest) {
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      duree: dureeTest,
      test_terminer: this.dateFinishTest
    }).toPromise().then(res => {
      console.log('succes time send');
      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + res.campaign.id).subscribe(res1 => {
        console.log('campaign : ', res1);
        const nbCandidats = res1.NbCandidatFinish;
        console.log(nbCandidats);
        this.apiClientService.put(API_URI_CAMPAIGNS + '/' + res.campaign.id, {
          NbCandidatFinish: nbCandidats + 1
        }).subscribe(res2 => {
          console.log('campaign : ', res2);
        });
      });
    });
  }
}
