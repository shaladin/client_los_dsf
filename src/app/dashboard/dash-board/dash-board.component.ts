import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '@progress/kendo-angular-menu';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
import { environment } from 'environments/environment';

declare var require: any;

const data: any = require('../../shared/data/chartist.json');
export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  Item : any;
  constructor() { }

  // line chart configuration Starts
  WidgetlineChart: Chart = {
    type: 'Line', data: data['WidgetlineChart'],
    options: {
      axisX: {
        showGrid: true,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0,
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true,
    },
  };
  // Line chart configuration Ends

  // Line area chart configuration Starts
  lineArea: Chart = {
    type: 'Line',
    data: data['lineAreaDashboard'],
    options: {
      low: 0,
      showArea: true,
      fullWidth: true,
      onlyInteger: true,
      axisY: {
        low: 0,
        scaleMinSpace: 50,
      },
      axisX: {
        showGrid: false
      }
    },
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient',
          x1: 0,
          y1: 1,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(0, 201, 255, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(146, 254, 157, 1)'
        });

        defs.elem('linearGradient', {
          id: 'gradient1',
          x1: 0,
          y1: 1,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(132, 60, 247, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(56, 184, 242, 1)'
        });
      },

    },
  };
  // Line area chart configuration Ends

  ngOnInit() {
    this.Item = {Url : environment.FoundationR3Url + "/ThingsToDo/GetThingsToDoByRole", Module : "LOS"};
  }

  showMessage(message: any) {
    console.log(message);
  }

  @ViewChild('treemenu') public gridContextMenu: ContextMenuComponent;

  public data: any[] = [
    {
      text: 'Furniture', items: [
        { text: 'Tables & Chairs' },
        { text: 'Sofas' },
        { text: 'Occasional Furniture' }
      ]
    },
    {
      text: 'Decor', items: [
        { text: 'Bed Linen' },
        { text: 'Curtains & Blinds' },
        { text: 'Carpets' }
      ]
    }
  ];

  public items: any[] = [{ text: 'Remove', icon: 'close' }];

  private contextItem: any;

  public onNodeClick(e: any): void {
    if (e.type == 'contextmenu') {
      const originalEvent = e.originalEvent;

      originalEvent.preventDefault();

      this.contextItem = e.item.dataItem;

      this.gridContextMenu.show({ left: originalEvent.pageX, top: originalEvent.pageY });
    }
  }

  public onSelect({ item }): void {
    if (item.text == 'Remove') {
      this.removeItem(this.contextItem, this.data);
    }
  }



  private removeItem(dataItem: any, items: any[]): void {
    const index = items.indexOf(dataItem);
    if (index >= 0) {
      items.splice(index, 1);
    } else {
      items.forEach(item => {
        if (item.items) {
          this.removeItem(dataItem, item.items);
        }
      });
    }
  }

}
