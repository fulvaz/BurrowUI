import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConsumerService } from '../services/consumer.service';
import {Observable, BehaviorSubject} from "rxjs/Rx";
import { EventhubService } from 'app/services/eventhub.service';
// import DateTimeFormat = Intl.DateTimeFormat;

@Component({
  selector: 'lag-graph',
  templateUrl: '../../templates/lag_graph.html',
})

export class LagGraphComponent implements OnInit, OnDestroy {
  lagWindow: Observable<Object[]>;
  maxLag: number = 0;
  minLag: number = 0;
  avgLag: number = 0;

  public lineChartData:Array<any>;

  public lineChartLabels:BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  get observableLabels(): Observable<Array<any>> {return this.lineChartLabels.asObservable()}

  public lineChartLegend:boolean = false;

  public lineChartType:string = 'line';

  public consumerData: Object[];

  public testVal: any;


  constructor(
    private consumerService: ConsumerService,
    private eventhubService: EventhubService
  ) {
    this.lagWindow = consumerService.lagWindow;
    this.lineChartData = [
      {data: [], label: this.consumerService.consumerName}
    ];
  };

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.lagWindow.subscribe(obj => {
      // if filterBy in eventhubService.lagFilter.getValue().filterBy === 'all', obj.totalLag as data
      this.consumerData = obj;

      let graphData = [];
      let filterBy = this.eventhubService.getCurrentFilter().filterBy;
      let filterValue = this.eventhubService.getCurrentFilter().filterValue;
      if (filterValue === 'all' || !filterValue) {
        filterValue = 'totalLag';
      }

      graphData = obj.map(e => {
        if (e[filterValue]) {
          return e[filterValue];
        } else {
          return 0;
        }
      });

      if (graphData.length > 0) {
        // never gen data in initial state
        let newLabels = this.lineChartLabels.getValue();
        let currentTime = new Date().toLocaleTimeString();
        newLabels.push(currentTime);
        this.lineChartLabels.next(newLabels);
      }

      this.drawLagChart(graphData);
      this.maxLag = Math.max(...graphData);
      this.minLag = Math.min(...graphData);
      let value = 0;
      graphData.forEach(num => {
        value += num;
      });
      this.avgLag = Math.floor(value/obj.length);


    });

    this.eventhubService.lagFilterObservable.subscribe(obj => {
      let graphData = [];
      let filterValue = obj.filterValue;
      if (filterValue === 'all' || !filterValue) {
        filterValue = 'totalLag';
      }
      // console.log('filter is ' + filterValue);

      graphData = this.consumerData.map(e => {
        if (e[filterValue]) {
          return e[filterValue];
        } else {
          return 0;
        }
      });
      this.testVal = graphData;

      this.drawLagChart(graphData);
    })
  }

  drawLagChart(newEntries: number[]): void {
    console.log('draw with data is:');
    console.log(newEntries);
    if (newEntries.length > 0) {
      let newData = this.lineChartData.slice(0);



      newData[0].data = newEntries;

      this.lineChartData = newData;
    }
  }

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(233,30,99,0.2)',
      borderColor: 'rgba(233,30,99,1)',
      pointBackgroundColor: 'rgba(0,150, 136, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 150, 136, 0.8)'
    }
  ];

}

interface ColorScheme {
  backgroundColor: string;
  borderColor: string;
  pointHoverBorderColor: string;
}
