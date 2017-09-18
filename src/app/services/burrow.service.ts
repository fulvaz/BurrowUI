import { Injectable } from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable, BehaviorSubject, Subject} from "rxjs/Rx";
import {Home} from "../classes/home";
import {ClusterHome} from "../classes/clusterHome";
import {ClusterConsumerHome} from "../classes/clusterConsumerHome";
import {Consumer} from "../classes/consumer";
import {ClusterTopicHome} from "../classes/clusterTopicHome";
import {Topic} from "../classes/topic";
import {environment as env} from '../../environments/environment';

@Injectable()
export class BurrowService {
  // Observable Home
  private _home: Subject<Home> = new Subject();
  get home(): Observable<Home> { return this._home.asObservable() };

  // Observable Cluster List
  private _clusters: BehaviorSubject<ClusterHome[]> = new BehaviorSubject([]);
  get clusters(): Observable<ClusterHome[]> { return this._clusters.asObservable() };

  // Dictionary of Consumers
  private consumerDictionary: ConsumerDictionary = {};
  private topicDictionary: TopicDictionary = {};

  constructor(private http: Http) {

  }

  // Setup Methods
  loadHomeView() : void {
    this.getHome().subscribe(obj => {
      this._home.next(obj);

      obj.clusters.forEach(cluster => {
        this.getCluster(cluster).subscribe(ref => {
          this.consumerDictionary[cluster] = [];
          this.topicDictionary[cluster] = [];

          this.getClusterConsumerHome(cluster).subscribe(clusterObj => {
            clusterObj.consumers.forEach(con => {
              this.getConsumer(cluster, con).subscribe(newCon => {
                this.consumerDictionary[cluster].push(newCon);
              });
            });
          });

          this.getClusterTopicHome(cluster).subscribe(clusterObj => {
            clusterObj.topics.forEach(top => {
              this.getTopic(cluster, top).subscribe(topic => {
                this.topicDictionary[cluster].push(topic);
              });
            });
          });

          let list = this._clusters.getValue();

          ref.consumers = this.consumerDictionary[cluster];
          ref.topics = this.topicDictionary[cluster];
          list.push(ref);
          this._clusters.next(list);
        });
      });
    });
  }

  // Home URL for Burrow
  private burrowUrl = env.production ? '/api/burrow' : 'http://localhost:3000/api/burrow';

  getHome() : Observable<Home> {
    return this.http.get(this.burrowUrl + "/home")
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getCluster(cluster: string) : Observable<ClusterHome> {
    return this.http.get(this.burrowUrl + "/cluster/" + cluster)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getClusterConsumerHome(cluster: string) : Observable<ClusterConsumerHome> {
    return this.http.get(this.burrowUrl + "/cluster/" + cluster + "/consumer")
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getConsumer(cluster: string, consumer: string) : Observable<Consumer> {
    return this.http.get(this.burrowUrl + "/cluster/" + cluster + "/consumer/" + consumer)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getClusterTopicHome(cluster: string) : Observable<ClusterTopicHome> {
    return this.http.get(this.burrowUrl + "/cluster/" + cluster + "/topic")
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getTopic(cluster: string, topic: string) : Observable<Topic> {
    return this.http.get(this.burrowUrl + "/cluster/" + cluster + "/topic/" + topic)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

}

interface ConsumerDictionary {
  [ index: string ]: Consumer[];
}

interface TopicDictionary {
  [ index: string ]: Topic[];
}
