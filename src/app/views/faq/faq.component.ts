import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  dataList = [];


  constructor(
    private route: ActivatedRoute,
  ) {
    this.dataList = this.route.snapshot.data['faqListResolve']._embedded.frequentlyAnswerQuestions;
   }

}
