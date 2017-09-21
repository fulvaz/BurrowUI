import { Injectable, OnInit } from '@angular/core';
import {Consumer} from "../classes/consumer";
import {Observable, BehaviorSubject, Subject} from "rxjs/Rx";
import {BurrowService} from "./burrow.service";
import {Params, ActivatedRoute} from "@angular/router";
import { EventhubService } from 'app/services/eventhub.service';

@Injectable()
export class ConsumerService implements OnInit {
  // Variables
  consumerName: string;
  clusterName: string;

  // Observable Consumer
  private _consumer: Subject<Consumer> = new Subject();
  get consumer(): Observable<Consumer> { return this._consumer.asObservable() };

  // Observable Lag Window
  private _lagWindow: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  get lagWindow(): Observable<Object[]> { return this._lagWindow.asObservable() };

  constructor(private burrowService: BurrowService, 
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.consumerName = params['consumer'];
      this.clusterName = params['cluster'];
      this.resetLagWindow();
      if (this.consumerName && this.clusterName) {
        this.burrowService.getConsumer(this.clusterName, this.consumerName).subscribe(cons => {
          this._consumer.next(cons);
        });
      }
    });
  }

  ngOnInit(): void {
  }

  resetLagWindow() {
    this._lagWindow.next([]);
  }

  refreshData() {
    if (!this.clusterName || !this.consumerName) {
      return;
    }
    this.burrowService.getConsumer(this.clusterName, this.consumerName).subscribe(cons => {
      // Add Total Lag Window
      let window = this._lagWindow.getValue();
      // window.push(cons.status.totallag);
      // this._lagWindow.next(window);

      // window now send more lag data to lag graph
      // [{
      //   topic1: 12321,
      //   topic2: 321321
      // }]
      const newLagData = {};
      cons.status.partitions.forEach(p => {
        newLagData[p.topic] = newLagData[p.topic] + p.end.lag || p.end.lag;
      });
      newLagData['totalLag'] = newLagData['totalLag'] + cons.status.totallag || cons.status.totallag; 
      window.push(newLagData);
      this._lagWindow.next(window);

      // Manage Partition Data

      // Update Consumer
      this._consumer.next(cons);
    });
  }

}
