import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
} from '../common/chart-configuration/chart-configuration';

interface TopicStrength {
  topic: string;
  accuracy: number;
}

@Component({
  selector: 'app-user-analytics',
  standalone: true,
  imports: [CommonModule, ChartConfiguration],
  templateUrl: './user-analytics.html',
  styleUrl: './user-analytics.scss',
})
export class UserAnalytics {
  // Strong vs. weak topics (bar chart)
  topicStrengthData: ChartData = {
    labels: ['Python', 'Java', 'History', 'Math', 'Computer Science'],
    series: [
      {
        name: 'Accuracy',
        type: 'bar',
        data: [88, 72, 64, 55, 91],
      },
    ],
  };

  topicStrengthOptions: ChartOptions = {
    title: {
      text: 'Strong vs Weak Topics',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
    },
  };

  // Accuracy over time (line chart)
  accuracyOverTimeData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    series: [
      {
        name: 'Accuracy',
        type: 'line',
        smooth: true,
        data: [58, 64, 71, 78, 84],
      },
    ],
  };

  accuracyOverTimeOptions: ChartOptions = {
    title: {
      text: 'Accuracy Over Time',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
    },
  };

  // Speed analysis (line chart – average time per question)
  speedData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    series: [
      {
        name: 'Avg. seconds per question',
        type: 'line',
        smooth: true,
        data: [42, 38, 35, 31, 28],
      },
    ],
  };

  speedOptions: ChartOptions = {
    title: {
      text: 'Speed Analysis',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}s/question',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
  };
}


