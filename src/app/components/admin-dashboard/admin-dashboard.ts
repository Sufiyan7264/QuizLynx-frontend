import { Component, OnInit, inject } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from '../common/chart-configuration/chart-configuration';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Auth } from '../../core/service/auth';
import { Instructor } from '../../core/service/instructor';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Common } from '../../core/common/common';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface TopStudent {
  name: string;
  averageScore: number;
  quizzesCompleted: number;
  status: string;
}

interface StudentNeedingAttention {
  name: string;
  score?: number;
  averageScore?: number;
  quizzesCompleted: number;
}


@Component({
  selector: 'app-admin-dashboard',
  imports: [ChartConfiguration, Dialog, Button, InputText, MultiSelect, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  visible: boolean = false;
  private fb = inject(FormBuilder);
  private common = inject(Common);
  updateForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    bio: ['', [Validators.maxLength(1000)]],
    subjects: [[], [Validators.required]],
    avatarUrl: ['']
  })
  subjectOptions = [
    {
      "label": "Mathematics",
      "value": "mathematics"
    },
    {
      "label": "English",
      "value": "english"
    },
    {
      "label": "Science",
      "value": "science"
    },
    {
      "label": "Physics",
      "value": "physics"
    },
    {
      "label": "Chemistry",
      "value": "chemistry"
    },
    {
      "label": "Biology",
      "value": "biology"
    },
    {
      "label": "History",
      "value": "history"
    },
    {
      "label": "Geography",
      "value": "geography"
    },
    {
      "label": "Social Studies",
      "value": "social_studies"
    },
    {
      "label": "Computer Science",
      "value": "computer_science"
    },
    {
      "label": "Information Technology",
      "value": "information_technology"
    },
    {
      "label": "Economics",
      "value": "economics"
    },
    {
      "label": "Business Studies",
      "value": "business_studies"
    },
    {
      "label": "Accounting",
      "value": "accounting"
    },
    {
      "label": "Physical Education",
      "value": "physical_education"
    },
    {
      "label": "Art & Design",
      "value": "art_design"
    },
    {
      "label": "Music",
      "value": "music"
    },
    {
      "label": "Drama",
      "value": "drama"
    },
    {
      "label": "French",
      "value": "french"
    },
    {
      "label": "Spanish",
      "value": "spanish"
    },
    {
      "label": "German",
      "value": "german"
    },
    {
      "label": "Hindi",
      "value": "hindi"
    },
    {
      "label": "Sanskrit",
      "value": "sanskrit"
    },
    {
      "label": "Literature",
      "value": "literature"
    },
    {
      "label": "Philosophy",
      "value": "philosophy"
    },
    {
      "label": "Psychology",
      "value": "psychology"
    },
    {
      "label": "Sociology",
      "value": "sociology"
    },
    {
      "label": "Political Science",
      "value": "political_science"
    },
    {
      "label": "Environmental Science",
      "value": "environmental_science"
    },
    {
      "label": "Statistics",
      "value": "statistics"
    },
    {
      "label": "Home Science",
      "value": "home_science"
    },
    {
      "label": "Agriculture",
      "value": "agriculture"
    },
    {
      "label": "Engineering Drawing",
      "value": "engineering_drawing"
    },
    {
      "label": "Electronics",
      "value": "electronics"
    },
    {
      "label": "Law",
      "value": "law"
    },
    {
      "label": "Civics",
      "value": "civics"
    },
    {
      "label": "Religious Studies",
      "value": "religious_studies"
    },
    {
      "label": "Health Education",
      "value": "health_education"
    },
    {
      "label": "Nutrition",
      "value": "nutrition"
    },
    {
      "label": "Other",
      "value": "other"
    }
  ];
  stats: StatCard[] = [];
  topStudents: TopStudent[] = [];
  studentsNeedingAttention: StudentNeedingAttention[] = [];
  quickStats = {
    totalStudents: 0,
    topPerformers: 0,
    averageCompletionTime: '0 min',
    averageScore: 0
  };
  studentEngagementData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Active Students',
      data: []
    }, {
      label: 'Quiz Completions',
      data: []
    }]
  };

  studentEngagementOptions: ChartOptions = {
    title: {
      text: 'Student Engagement Over Time',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a' // slate-900
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Active Students', 'Quiz Completions'],
      top: '12%'
    },
    grid: {
      top: '25%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    }
  };
  studentPerformanceData: ChartData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
    datasets: [{
      label: 'Average Score (%)',
      data: []
    }]
  };

  studentPerformanceOptions: ChartOptions = {
    title: {
      text: 'Student Performance by Quiz',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    }
  };
  quizCompletionData: ChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: []
    }],
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['60%', '55%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0,
      },
      title: {
        text: 'Quiz Completion Status',
        left: '1%'
      },

      label: {
        show: true,
        formatter: '{b}: {d}%',
        fontSize: 11,
        position: 'outside',
        textBorderColor: 'transparent',
        textBorderWidth: 0,
        textStyle: {
          textBorderColor: 'transparent',
          textBorderWidth: 0
        }
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 8
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold',
          textBorderColor: 'transparent',
          textBorderWidth: 0,
          textStyle: {
            textBorderColor: 'transparent',
            textBorderWidth: 0
          }
        }
      },
      data: [
        { value: 0, name: 'Completed' },
        { value: 0, name: 'In Progress' },
        { value: 0, name: 'Not Started' }
      ]
    }]
  };

  quizCompletionOptions: ChartOptions = {
    title: {
      text: 'Quiz Completion Status',
      left: 'center',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: '5%',
      itemGap: 10,
      textStyle: {
        fontSize: 12
      }
    }
  };
  performanceSummaryData: ChartData = {
    labels: ['90-100%', '75-89%', '60-74%', 'Below 60%'],
    datasets: [{
      data: []
    }],
    series: [{
      name: 'Performance Distribution',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0,
      },
      label: {
        show: true,
        formatter: '{b}: {c}',
        fontSize: 11,
        position: 'outside'
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 5
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: []
    }]
  };

  performanceSummaryOptions: ChartOptions = {
    title: {
      text: 'Student Performance Distribution',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} students ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: '5%',
      itemGap: 10,
      textStyle: {
        fontSize: 12
      }
    }
  };
  private authService = inject(Auth);
  private instructorService = inject(Instructor);
  private currentUser: any = "";

  ngOnInit(): void {
    // this.authService.user$.subscribe((u: any) => this.currentUser = u);
    // if (this.currentUser.role == 'INSTRUCTOR') {
    //   this.getInstructorInfo();
    // }
    // this.instructorService.getDashboardStats().subscribe(data => {
    //   this.stats = data.stats;
    //   this.quickStats = data.quickStats;
    //   this.topStudents = data.topStudents;
    //   this.studentsNeedingAttention = data.studentsNeedingAttention;
    //   this.studentEngagementData = data.studentEngagement; // Ensure structure matches Chart.js
    //   this.studentPerformanceData = data.studentPerformance;
    //   this.quizCompletionData = data.quizCompletion;
    //   this.performanceSummaryData = data.performanceDistribution;
    // });
  }
  getInstructorInfo() {
    this.instructorService.getInstructorInfo().subscribe({
      next: (res: any) => {
        if (res?.instructorCode) {
          this.visible = false;
        }
        else {
          this.visible = true;
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  onSubmit() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    this.common.showSpinner();
    this.instructorService.updateInstructorProfile(this.updateForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.common.showMessage('success', 'Success', 'Profile updated successfully');
        this.visible = false;
        this.common.hideSpinner();
      },
      error: (err: any) => {
        console.log(err);
        this.common.showMessage('error', 'Error', err.message || 'Something went wrong');
        this.common.hideSpinner();
      }
    })
  }
}
