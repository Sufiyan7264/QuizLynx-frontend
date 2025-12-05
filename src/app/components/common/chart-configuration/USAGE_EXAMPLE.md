# Chart Configuration Component Usage

This component provides a dynamic chart configuration system using Apache ECharts. It supports multiple chart types and can be easily integrated into any parent component.

## Basic Usage

### 1. Import the Component

```typescript
import { ChartConfiguration } from './components/common/chart-configuration/chart-configuration';
```

### 2. Use in Template

```html
<app-chart-configuration
  [chartType]="'line'"
  [data]="chartData"
  [width]="'100%'"
  [height]="'400px'"
  [options]="chartOptions">
</app-chart-configuration>
```

## Chart Types Supported

- `line` - Line chart
- `bar` - Bar chart
- `pie` - Pie chart
- `scatter` - Scatter plot
- `radar` - Radar chart
- `gauge` - Gauge chart
- `funnel` - Funnel chart
- `heatmap` - Heatmap chart
- `tree` - Tree chart
- `treemap` - Treemap chart
- `sunburst` - Sunburst chart
- `sankey` - Sankey diagram
- `graph` - Graph chart
- `parallel` - Parallel coordinates
- `candlestick` - Candlestick chart
- `boxplot` - Boxplot chart
- `map` - Map chart

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `chartType` | `ChartType` | `'line'` | Type of chart to render |
| `data` | `ChartData` | `{}` | Chart data (labels, datasets, series) |
| `width` | `string \| number` | `'100%'` | Chart width |
| `height` | `string \| number` | `'400px'` | Chart height |
| `options` | `ChartOptions` | `{}` | Additional ECharts options |
| `theme` | `string` | `undefined` | ECharts theme name |
| `loading` | `boolean` | `false` | Show loading state |
| `loadingOptions` | `any` | `undefined` | Loading options |

## Examples

### Line Chart

```typescript
// Component TypeScript
export class MyComponent {
  lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sales',
      data: [150, 230, 224, 218, 135, 147, 260]
    }]
  };

  lineChartOptions = {
    title: {
      text: 'Weekly Sales',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    }
  };
}
```

```html
<app-chart-configuration
  [chartType]="'line'"
  [data]="lineChartData"
  [width]="'100%'"
  [height]="'400px'"
  [options]="lineChartOptions">
</app-chart-configuration>
```

### Bar Chart

```typescript
barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [1200, 1900, 3000, 2500, 2200]
  }]
};
```

```html
<app-chart-configuration
  [chartType]="'bar'"
  [data]="barChartData"
  [width]="'100%'"
  [height]="'400px'">
</app-chart-configuration>
```

### Pie Chart

```typescript
pieChartData = {
  labels: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
  datasets: [{
    data: [335, 310, 234, 135, 1548]
  }]
};
```

```html
<app-chart-configuration
  [chartType]="'pie'"
  [data]="pieChartData"
  [width]="'100%'"
  [height]="'400px'">
</app-chart-configuration>
```

### Using Series Data (Advanced)

For more control, you can pass series directly:

```typescript
advancedChartData = {
  series: [
    {
      name: 'Series 1',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Series 2',
      type: 'bar',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
};
```

```html
<app-chart-configuration
  [chartType]="'line'"
  [data]="advancedChartData"
  [width]="'100%'"
  [height]="'500px'">
</app-chart-configuration>
```

### With Custom Options

```typescript
customOptions = {
  title: {
    text: 'Custom Chart',
    subtext: 'Subtitle here',
    left: 'center'
  },
  legend: {
    data: ['Series 1', 'Series 2'],
    top: '10%'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E']
  },
  yAxis: {
    type: 'value'
  }
};
```

```html
<app-chart-configuration
  [chartType]="'bar'"
  [data]="chartData"
  [options]="customOptions"
  [width]="'800px'"
  [height]="'600px'">
</app-chart-configuration>
```

### With Loading State

```html
<app-chart-configuration
  [chartType]="'line'"
  [data]="chartData"
  [loading]="isLoading"
  [loadingOptions]="{ text: 'Loading...', color: '#4f46e5' }">
</app-chart-configuration>
```

## Data Structure

### Using datasets (simpler)

```typescript
{
  labels: string[];        // X-axis labels or category names
  datasets: Array<{
    label?: string;        // Series name
    data: number[];        // Data values
    [key: string]: any;    // Additional ECharts series options
  }>;
}
```

### Using series (advanced)

```typescript
{
  series: any[];           // Direct ECharts series configuration
  labels?: string[];       // Optional labels for reference
}
```

## Public Methods

### getChartInstance()

Get the underlying ECharts instance for advanced operations:

```typescript
@ViewChild(ChartConfiguration) chartComponent!: ChartConfiguration;

someMethod() {
  const chartInstance = this.chartComponent.getChartInstance();
  if (chartInstance) {
    // Use ECharts API directly
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: 0
    });
  }
}
```

### refresh()

Manually refresh the chart:

```typescript
this.chartComponent.refresh();
```

## Notes

- The component automatically handles window resize events
- Charts are automatically disposed when the component is destroyed
- The component supports all ECharts options through the `options` input
- Default colors are provided if not specified in options
- The component is responsive and will resize automatically


