import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'gauge' | 'funnel' | 'heatmap' | 'tree' | 'treemap' | 'sunburst' | 'sankey' | 'graph' | 'parallel' | 'candlestick' | 'boxplot' | 'map';

export interface ChartData {
  labels?: string[];
  datasets?: any[];
  series?: any[];
  [key: string]: any;
}

export interface ChartOptions {
  title?: {
    text?: string;
    subtext?: string;
    left?: string | number;
    top?: string | number;
    textStyle?: any;
  };
  tooltip?: any;
  legend?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  color?: string[];
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-chart-configuration',
  imports: [CommonModule],
  templateUrl: './chart-configuration.html',
  styleUrl: './chart-configuration.scss'
})
export class ChartConfiguration implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLDivElement>;
  
  @Input() chartType: ChartType = 'line';
  @Input() data: ChartData = {};
  @Input() width: string | number = '100%';
  @Input() height: string | number = '200px';
  @Input() options: ChartOptions = {};
  @Input() theme?: string;
  @Input() loading: boolean = false;
  @Input() loadingOptions?: any;

  private chartInstance: echarts.ECharts | null = null;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartInstance) {
      if (changes['chartType'] || changes['data'] || changes['options']) {
        this.updateChart();
      }
      if (changes['width'] || changes['height']) {
        this.resizeChart();
      }
      if (changes['loading']) {
        if (this.loading) {
          this.chartInstance.showLoading(this.loadingOptions);
        } else {
          this.chartInstance.hideLoading();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  }

  private initChart(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.chartInstance = echarts.init(
      this.chartContainer.nativeElement,
      this.theme,
      {renderer:'svg'}
    );

    this.updateChart();

    // Handle window resize
    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => {
    this.resizeChart();
  };

  private resizeChart(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }

  private updateChart(): void {
    if (!this.chartInstance) {
      return;
    }

    const option = this.buildChartOption();
    this.chartInstance.setOption(option, true);
  }

  private buildChartOption(): any {
    const baseOption: any = {
      ...this.options,
      color: this.options.color || this.getDefaultColors(),
      backgroundColor: this.options.backgroundColor || 'transparent',
      animation: this.options.animation !== undefined ? this.options.animation : true,
      animationDuration: this.options.animationDuration || 1000,
    };

    // Add title if provided
    if (this.options.title) {
      baseOption.title = this.options.title;
    }
    baseOption.textStyle = {
      fontFamily: 'Mona Sans, sans-serif',
      fontSize: 12,
      fontWeight: 'normal',
      color: '#000'
    }

    // Add tooltip if not provided
    if (!baseOption.tooltip) {
      baseOption.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
    }

    // Build chart-specific configuration
    switch (this.chartType) {
      case 'line':
        return this.buildLineChartOption(baseOption);
      case 'bar':
        return this.buildBarChartOption(baseOption);
      case 'pie':
        return this.buildPieChartOption(baseOption);
      case 'scatter':
        return this.buildScatterChartOption(baseOption);
      case 'radar':
        return this.buildRadarChartOption(baseOption);
      case 'gauge':
        return this.buildGaugeChartOption(baseOption);
      case 'funnel':
        return this.buildFunnelChartOption(baseOption);
      case 'heatmap':
        return this.buildHeatmapChartOption(baseOption);
      default:
        return this.buildLineChartOption(baseOption);
    }
  }

  private buildLineChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'axis'
      },
      legend: this.options.legend || (this.data.labels ? { data: this.data.labels } : {}),
      grid: this.options.grid || {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: this.options.xAxis || {
        type: 'category',
        boundaryGap: false,
        data: this.data.labels || [],
      },
      yAxis: this.options.yAxis || {
        type: 'value',
          splitLine: {
            show: true, // Ensure grid lines are shown
            lineStyle: {
                color: 'var(--color-border)', 
                type: 'dashed' 
            }
          }
      },
      series: this.data.series || this.buildSeriesFromDatasets('line')
    };

    return option;
  }

  private buildBarChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: this.options.legend || (this.data.labels ? { data: this.data.labels } : {}),
      grid: this.options.grid || {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: this.options.xAxis || {
        type: 'category',
        data: this.data.labels || []
      },
      yAxis: this.options.yAxis || {
        type: 'value',
        splitLine: {
          show: true, // Ensure grid lines are shown
          lineStyle: {
              color: 'var(--color-border)', 
              type: 'dashed' 
          }
        }
      },
      series: this.data.series || this.buildSeriesFromDatasets('bar')
    };

    return option;
  }

  private buildPieChartOption(baseOption: any): any {
    const defaultSeries = {
      name: this.options.title?.text || 'Data',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 0
      },
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)',
        textBorderColor: 'transparent',
        textBorderWidth: 0
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold',
          textBorderColor: 'transparent',
          textBorderWidth: 0
        }
      },
      data: this.buildPieData()
    };

    // If custom series are provided, merge label properties to remove outline
    let series = this.data.series || [defaultSeries];
    if (this.data.series) {
      series = this.data.series.map((s: any) => {
        const mergedSeries = { ...s };
        // Merge label properties to ensure outline is removed
        if (mergedSeries.label) {
          mergedSeries.label = {
            ...mergedSeries.label,
            textBorderColor: 'transparent',
            textBorderWidth: 0,
            textStyle: {
              ...mergedSeries.label.textStyle,
              textBorderColor: 'transparent',
              textBorderWidth: 0
            }
          };
        } else {
          mergedSeries.label = {
            textBorderColor: 'transparent',
            textBorderWidth: 0
          };
        }
        // Merge emphasis label properties
        if (mergedSeries.emphasis?.label) {
          mergedSeries.emphasis.label = {
            ...mergedSeries.emphasis.label,
            textBorderColor: 'transparent',
            textBorderWidth: 0,
            textStyle: {
              ...mergedSeries.emphasis.label.textStyle,
              textBorderColor: 'transparent',
              textBorderWidth: 0
            }
          };
        } else if (mergedSeries.emphasis) {
          mergedSeries.emphasis.label = {
            ...mergedSeries.emphasis.label,
            textBorderColor: 'transparent',
            textBorderWidth: 0
          };
        }
        return mergedSeries;
      });
    }

    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: this.options.legend || {
        orient: 'vertical',
        left: 'left'
      },
      series: series
    };

    return option;
  }

  private buildScatterChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'item'
      },
      xAxis: this.options.xAxis || {
        type: 'value',
        scale: true
      },
      yAxis: this.options.yAxis || {
        type: 'value',
        scale: true
      },
      series: this.data.series || this.buildSeriesFromDatasets('scatter')
    };

    return option;
  }

  private buildRadarChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'item'
      },
      radar: {
        indicator: this.data.labels?.map(label => ({ name: label, max: 100 })) || []
      },
      series: this.data.series || [{
        type: 'radar',
        data: this.buildRadarData()
      }]
    };

    return option;
  }

  private buildGaugeChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        formatter: '{a} <br/>{b}: {c}%'
      },
      series: this.data.series || [{
        name: this.options.title?.text || 'Gauge',
        type: 'gauge',
        detail: { formatter: '{value}%' },
        data: this.buildGaugeData()
      }]
    };

    return option;
  }

  private buildFunnelChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: this.data.series || [{
        name: this.options.title?.text || 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: this.buildPieData()
      }]
    };

    return option;
  }

  private buildHeatmapChartOption(baseOption: any): any {
    const option = {
      ...baseOption,
      tooltip: {
        ...baseOption.tooltip,
        position: 'top'
      },
      grid: this.options.grid || {
        height: '50%',
        top: '10%'
      },
      xAxis: this.options.xAxis || {
        type: 'category',
        data: this.data.labels || [],
        splitArea: {
          show: true
        }
      },
      yAxis: this.options.yAxis || {
        type: 'category',
        data: this.data.labels || [],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: this.data.series || [{
        name: 'Heatmap',
        type: 'heatmap',
        data: this.buildHeatmapData(),
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    return option;
  }

  private buildSeriesFromDatasets(type: string): any[] {
    if (!this.data.datasets || this.data.datasets.length === 0) {
      return [];
    }

    return this.data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: type,
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
      },
      data: dataset.data || [],
      ...dataset
    }));
  }

  private buildPieData(): any[] {
    if (this.data.datasets && this.data.datasets.length > 0) {
      const dataset = this.data.datasets[0];
      return (dataset.data || []).map((value: any, index: number) => ({
        value: value,
        name: this.data.labels?.[index] || `Item ${index + 1}`
      }));
    }
    return [];
  }

  private buildRadarData(): any[] {
    if (!this.data.datasets || this.data.datasets.length === 0) {
      return [];
    }

    return this.data.datasets.map((dataset) => ({
      value: dataset.data || [],
      name: dataset.label || 'Series'
    }));
  }

  private buildGaugeData(): any[] {
    if (this.data.datasets && this.data.datasets.length > 0) {
      const dataset = this.data.datasets[0];
      return (dataset.data || []).map((value: any, index: number) => ({
        value: value,
        name: this.data.labels?.[index] || `Item ${index + 1}`
      }));
    }
    return [{ value: 0, name: 'Value' }];
  }

  private buildHeatmapData(): any[] {
    if (!this.data.datasets || this.data.datasets.length === 0) {
      return [];
    }

    const data: any[] = [];
    const dataset = this.data.datasets[0];
    const labels = this.data.labels || [];

    if (Array.isArray(dataset.data)) {
      dataset.data.forEach((value: any, index: number) => {
        const row = Math.floor(index / labels.length);
        const col = index % labels.length;
        data.push([col, row, value]);
      });
    }

    return data;
  }

  private getDefaultColors(): string[] {
    return [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'
    ];
  }

  // Public method to get chart instance (useful for advanced operations)
  public getChartInstance(): echarts.ECharts | null {
    return this.chartInstance;
  }

  // Public method to manually refresh chart
  public refresh(): void {
    if (this.chartInstance) {
      this.updateChart();
    }
  }
}


