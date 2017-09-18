import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { ROUTES }             from '../routing/routes';
import { AppComponent }       from '../components/app.component';
import { ConsumerComponent }  from '../components/consumer.component';
import { HomeComponent }      from "../components/home.component";
import { ErrorComponent }     from "../components/error.component";
import { LagGraphComponent}   from "../components/lag_graph.component"
import { PartitionTableComponent}   from "../components/partition_table.component"
import { RouterModule }       from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ConsumerService } from "../services/consumer.service";
import { ChartsModule } from 'ng2-charts';
import { HttpModule, JsonpModule } from '@angular/http';
import { TopicSortPipe } from "../classes/topic";
import { ClusterSortPipe } from "../classes/clusterHome";
import { ConsumerSortPipe } from "../classes/consumer";
import { PartitionFilterPipe } from "../classes/partition";
import { DisplayConsumersComponent } from "../components/display_consumers.component";
import { AvailableClustersComponent } from "../components/available_clusters.component";
import { DisplayTopicsComponent } from "../components/display_topics.component";
import { BurrowService } from "../services/burrow.service";
import { HomeService } from "../services/home.service";
import { DropdownModule } from '../components/dropdown/index';
import { TableFilterPipe} from '../components/table-filter.pipe';


@NgModule({
  imports:      [ 
    BrowserModule,
    RouterModule.forRoot(ROUTES), 
    FormsModule, 
    ChartsModule, 
    HttpModule, 
    JsonpModule, 
    DropdownModule,
  ],
  declarations: [ 
    AppComponent,
    ConsumerComponent, 
    HomeComponent, 
    ErrorComponent, 
    LagGraphComponent, 
    PartitionTableComponent, 
    PartitionFilterPipe, 
    TopicSortPipe, 
    ConsumerSortPipe, 
    DisplayConsumersComponent, 
    AvailableClustersComponent, 
    DisplayTopicsComponent, 
    ClusterSortPipe,
    TableFilterPipe,
  ],
  bootstrap:    [ AppComponent ],
  providers:    [ ConsumerService, BurrowService, HomeService ],
})
export class AppModule { }
