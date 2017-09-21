import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class EventhubService {

    private lagFilter: BehaviorSubject<LagFilterMsg> = new BehaviorSubject<LagFilterMsg>({ filterBy: '', filterValue: '' });
    get lagFilterObservable(): Observable<LagFilterMsg> {return this.lagFilter.asObservable(); }

    constructor(private route: ActivatedRoute) {
        this.route.queryParams.subscribe(e => {
            this.emitFilter({filterBy: '', filterValue: ''});
        });
    }

    public emitFilter(msg: LagFilterMsg): void {
        this.lagFilter.next(msg);
    }

    public getCurrentFilter(): LagFilterMsg {
        return this.lagFilter.getValue();
    }

}

interface LagFilterMsg {
    filterBy: string;
    filterValue: string;
}
