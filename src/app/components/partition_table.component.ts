import { Component, OnInit } from '@angular/core';
import { Consumer } from '../classes/consumer';
import { ConsumerService } from '../services/consumer.service';
import { EventhubService } from 'app/services/eventhub.service';

@Component({
  selector: 'partition-table',
  templateUrl: '../../templates/partition_table.html',
})

export class PartitionTableComponent implements OnInit {
  consumer: Consumer;
  toggle: boolean = true;
  topicDropdownData = [];
  filterBy = {topic: undefined};
  tableData: any[];
  currentTopics = [];

  constructor(private consumerService: ConsumerService, private eventhubService: EventhubService) {
  };

  ngOnInit(): void {
    this.consumerService.consumer.subscribe(obj => {
      this.consumer = obj;
      this.tableData = [...this.consumer.status.partitions];

      // init topicDropDownData
      if (!this.topicDropdownData.length) {
        this.topicDropdownData.unshift({
          label: 'All',
          command: () => {
            this.onTHeadClick('topic', 'all');
            this.eventhubService.emitFilter({filterBy: 'topic', filterValue: 'all'});
          }
        });
      }

      // get topic list every time data update
      // extract topic from table data, but topics in table data may be duplicated
      const newTopics = this.tableData.reduce(
        (prev: string[], curr, currIdx, arr): string[] => {
          if (prev.indexOf(curr.topic) === -1) {
            const result = Array.from(prev);
            result.push(curr.topic);
            return result;
          } else {
            return prev;
          }
      }, []);

      this.currentTopics.push(...newTopics);
      this.currentTopics = this.deduplicateArr(this.currentTopics).sort();

      this.topicDropdownData = [this.topicDropdownData[0], ...this.genDropDownItem(this.currentTopics)];

    });
  }

  /**
   * 
   * @param key thead title 
   * @param value thead item
   * pass filterBy a param with the shape of {tableHead: filter}
   */
  onTHeadClick(key: string, value: string) {
    this.filterBy[key] = value;
    this.filterBy = Object.assign({}, this.filterBy); // copy the obj
  }

  filterDataBy(filter: string) {

  }

  get pipeString(): string[] {
    return this.toggle ? ["WARN", "STOP", "STALL", "ERR", "OK"] : ["WARN", "STOP", "STALL", "ERR"];
  }

  get sortTitle(): string {
    return this.toggle ? "Hide OK" : "Show OK";
  }

  toggleSort() { this.toggle = !this.toggle }

  private genDropDownItem(newTopics) {
    return newTopics.map(topic => {
      return {
        label: topic,
        command: () => {
          this.onTHeadClick('topic', topic);
          this.eventhubService.emitFilter({filterBy: 'topic', filterValue: topic});
        },
      };
    });
  }

  private deduplicateArr(arr) {
    return arr.reduce((curr, next) => {
      if (curr.indexOf(next) === -1) {
        curr.push(next);
      }
      return curr;
    }, []);
  }

}
