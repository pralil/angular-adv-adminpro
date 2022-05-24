import { Component, Input } from '@angular/core';
import { ChartData, ChartType, Color } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input('title') titulo: string = 'Sin titulo';
  
  public colors: Color[] = ['#9E120E','#FF5800','#FFB414']; 

  @Input('labels') doughnutChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  @Input('data') data: number[] = [ 350, 450, 100 ];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: this.data,
        backgroundColor: this.colors,
        borderWidth: 1
      }
      
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';


}
