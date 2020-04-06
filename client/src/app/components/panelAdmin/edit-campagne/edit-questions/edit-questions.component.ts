import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TooltipPosition, MatSnackBar } from "@angular/material";
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_QUESTIONS,
} from "../../../../api-client/api-client.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { FormControl } from "@angular/forms";
import { element } from "protractor";
@Component({
  selector: "app-edit-questions",
  templateUrl: "./edit-questions.component.html",
  styleUrls: ["./edit-questions.component.scss"],
})
export class EditQuestionsComponent implements OnInit {
  public globalId;
  public campaing;
  public yourCampaign;
  public allQuestions;
  public allQuestionsCampaign;
  public questionsByCampaign;
  public searchText = "";
  public positionOptions: TooltipPosition[] = [
    "after",
    "before",
    "above",
    "below",
    "left",
    "right",
  ];
  public toppings = new FormControl();
  public toppingsDifficulty = new FormControl();
  public toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato",
  ];
  public difficulty = ["facile", "moyen", "expert"];
  public boelanIsSearchAdvenced: boolean = false;
  public saveallQuestionsCampaign = [];
  public techno = [];
  public allTechno = [];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  constructor(
    private route: ActivatedRoute,
    public apiClientService: ApiClientService,
    private _snackBar: MatSnackBar
  ) {
    this.route.parent.params.subscribe((params) => {
      this.globalId = params.id;
    });
  }

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS + "/" + this.globalId)
      .subscribe((response) => {
        this.yourCampaign = response;
        this.yourCampaign.technologies.forEach((element) => {
          this.techno.push(element);
        });

        const newQuestion = [];
        this.allTechno = this.techno;
        this.loadAllQuestion(this.yourCampaign.questions);

        // this.loadAllQuestion();

        // const allquestionVariable = this.loadAllQuestion();
        // console.log('bonne solution',allquestionVariable)

        // if(this.techno && this.techno != []){
        //    console.log('le test pour voir si ce bon',this.loadAllQuestion())
        // }

        // this.allQuestions = [...this.loadAllQuestion()]
        const nameQuestionByTechno = [];
        this.yourCampaign.questions.forEach((element) => {
          nameQuestionByTechno.push(element.name);
        });

        for (let techno of this.allTechno) {
          for (let question of this.yourCampaign.questions) {
            newQuestion.push({ ...question, technologies: techno });
          }
        }

        this.questionsByCampaign = newQuestion;
        // console.log("this.questionsByCampaign", this.questionsByCampaign);
      });
  }

  populateQuestions(yourCampaign) {
    let technos = this.techno;
    yourCampaign.forEach((element) => {
      const technoIndex = technos.findIndex(
        (t) =>
          t && t.id && t.id.toString() === element.technologies.id.toString()
      );

      if (technoIndex < 0) {
        technos.push(element.technologies);
      }
    });

    const newQuestion = [];

    for (let techno of technos) {
      for (let question of yourCampaign) {
        if (techno.id.toString() === question.technologies.id.toString()) {
          // if (
          //   newQuestion.findIndex(
          //     (q) => q && q.id.toString() === question.id.toString()
          //   ) < 0
          // ) {
          //   newQuestion.push({ ...question, technologies: techno });
          // }

          newQuestion.push({ ...question, technologies: techno });
        }
      }
    }

    this.questionsByCampaign = newQuestion;
    this.yourCampaign = yourCampaign;
    this.allTechno = technos;
    // return newQuestion;
  }
  chargeYourCampagn(event) {
    console.log("on vien de recupere event", event);
    // this.yourCampaign = event;
    this.populateQuestions(event);
  }

  loadAllQuestion(yourCampaignQuestions): any {
    let url = "";
    this.techno.forEach((tech, index) => {
      if (index === 0) {
        url += `?technologies_in=${tech.id}`;
      } else {
        url += `&technologies_in=${tech.id}`;
      }
    });

    this.apiClientService
      .get(`${API_URI_QUESTIONS}${url}`)
      .subscribe((response) => {
        this.allQuestions = response;
        for (let questionLevel of yourCampaignQuestions) {
          this.allQuestionsCampaign = this.allQuestions.filter(
            (question) => question != questionLevel
          );
        }
        console.log(
          "yourCampaignQuestions in loadAllQuestionmanZerm",
          yourCampaignQuestions
        );
        console.log("la data est la", this.allQuestions);
        return response;

        // console.log('le test pour voir si ce bon',this.allQuestions)
        //   for(let questionOfLevel of this.questionsByCampaign){
        //   this.allQuestionsCampaign = this.allQuestions.filter(question => question != questionOfLevel);
        // }

        // return response;
      });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return (
      ("0" + h).slice(-2) +
      ":" +
      ("0" + m).slice(-2) +
      ":" +
      ("0" + s).slice(-2)
    );
    // return (m - (m %= 60)) / 60 + (9 < m ? ':' : ':0') + m;
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced;
  }

  filtreTechno(element) {
    const valueChecked = [];

    element.value.forEach((valueCheck) => {
      if (valueChecked.includes(valueCheck)) {
        for (let value of valueChecked) {
          let newFilter = this.allQuestionsCampaign.filter(
            (element) => element.technologies.name == value
          );
          this.allQuestionsCampaign = newFilter;
        }
      } else {
        valueChecked.push(valueCheck);
      }
    });

    console.log("allquestion---------->", this.allQuestionsCampaign);
  }
}
