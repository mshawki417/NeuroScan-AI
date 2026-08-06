import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
Chart.register(...registerables);

@Component({
  selector: 'app-performance', standalone: true, imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './performance.component.html', styleUrl: './performance.component.scss'
})
export class PerformanceComponent implements AfterViewInit {
  @ViewChildren('c1,c2,c3') cvs!: QueryList<ElementRef<HTMLCanvasElement>>;

  metrics = [
    { lbl: 'Accuracy',  val: '95.69%', sub: 'Best: ConvNeXt-Tiny', color: '#22d3ee' },
    { lbl: 'Precision', val: '96.07%', sub: 'Best: ConvNeXt-Tiny', color: '#3b8ef0' },
    { lbl: 'Recall',    val: '95.69%', sub: 'Best: ConvNeXt-Tiny', color: '#22c55e' },
    { lbl: 'F1 Score',  val: '95.63%', sub: 'Best: ConvNeXt-Tiny', color: '#eab308' },
  ];

  cm = {
    hdrs: ['Glioma','Meningioma','Pituitary','No Tumor'],
    rows: [
      { lbl:'Glioma',     v:[125,10,2,1],   max:160 },
      { lbl:'Meningioma', v:[7,142,3,1],    max:160 },
      { lbl:'Pituitary',  v:[1,1,147,0],    max:160 },
      { lbl:'No Tumor',   v:[0,2,1,148],    max:160 },
    ]
  };

  getCls(v:number,max:number){
    const r=v/max;
    return r>.8 ? 'hi' : r>.04 ? 'md' : 'lo';
  }

  ngAfterViewInit(){ setTimeout(()=>this.buildCharts(),80); }

  buildCharts(){
    const a=this.cvs.toArray();
    if(a.length<3) return;

    const chartDefaults = {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } }
    };

    // Bar
    new Chart(a[0].nativeElement, {
      type:'bar',
      data:{
        labels:['EfficientNet-B4','ConvNeXt-Tiny','ResNet-50'],
        datasets:[{
          data:[94.75,95.69,94.13],
          backgroundColor:['#1d6fdc','#22d3ee','#3b8ef0'],
          borderRadius:6, borderSkipped:false
        }]
      },
      options:{
        ...chartDefaults,
        scales:{
          y:{ min:92,max:97, ticks:{color:'#475569',font:{size:11}}, grid:{color:'rgba(255,255,255,.05)'} },
          x:{ ticks:{color:'#475569',font:{size:11}}, grid:{display:false} }
        },
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label:(c:any)=>` ${c.raw}%`}}
        }
      }
    });

    // ROC
    const pts=(data:number[])=>data;
    new Chart(a[1].nativeElement, {
      type:'line',
      data:{
        labels:[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1],
        datasets:[
          {label:'Glioma (0.97)',    data:[0,.53,.70,.80,.86,.91,.94,.96,.97,.99,1], borderColor:'#ef4444',borderWidth:2,fill:false,pointRadius:0,tension:.4},
          {label:'Meningioma (0.98)',data:[0,.60,.76,.85,.90,.93,.95,.97,.98,1,1],   borderColor:'#eab308',borderWidth:2,fill:false,pointRadius:0,tension:.4},
          {label:'Pituitary (0.99)', data:[0,.68,.82,.90,.94,.96,.97,.99,1,1,1],    borderColor:'#3b8ef0',borderWidth:2,fill:false,pointRadius:0,tension:.4},
          {label:'No Tumor (0.99)',  data:[0,.70,.84,.91,.95,.97,.98,1,1,1,1],      borderColor:'#22c55e',borderWidth:2,fill:false,pointRadius:0,tension:.4},
          {label:'Random',           data:[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1],         borderColor:'rgba(100,116,139,.3)',borderWidth:1,fill:false,pointRadius:0,borderDash:[4,4]},
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{ legend:{ display:true, labels:{ color:'#94a3b8',font:{size:10},boxWidth:12 } } },
        scales:{
          x:{ title:{display:true,text:'False Positive Rate',color:'#475569',font:{size:11}}, ticks:{color:'#475569',font:{size:10}}, grid:{color:'rgba(255,255,255,.04)'} },
          y:{ title:{display:true,text:'True Positive Rate',color:'#475569',font:{size:11}},  ticks:{color:'#475569',font:{size:10}}, grid:{color:'rgba(255,255,255,.04)'} }
        }
      }
    });

    // Training curves
    const ep=Array.from({length:30},(_,i)=>i+1);
    new Chart(a[2].nativeElement, {
      type:'line',
      data:{
        labels:ep,
        datasets:[
          {label:'Accuracy',data:[.72,.80,.84,.87,.89,.90,.91,.92,.93,.93,.93,.94,.94,.945,.946,.946,.947,.947,.947,.948,.948,.948,.948,.948,.949,.949,.949,.949,.949,.949],borderColor:'#3b8ef0',borderWidth:2,fill:false,pointRadius:0,tension:.4},
          {label:'Loss',    data:[.90,.70,.55,.43,.35,.29,.24,.20,.18,.16,.15,.13,.12,.11,.10,.10,.09,.09,.09,.09,.08,.08,.08,.08,.08,.08,.08,.08,.08,.08],borderColor:'#ef4444',borderWidth:2,fill:false,pointRadius:0,tension:.4},
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{ legend:{ display:true, labels:{ color:'#94a3b8',font:{size:10},boxWidth:12 } } },
        scales:{
          x:{ title:{display:true,text:'Epoch',color:'#475569',font:{size:11}}, ticks:{color:'#475569',font:{size:10}}, grid:{color:'rgba(255,255,255,.04)'} },
          y:{ ticks:{color:'#475569',font:{size:10}}, grid:{color:'rgba(255,255,255,.04)'} }
        }
      }
    });
  }
}
