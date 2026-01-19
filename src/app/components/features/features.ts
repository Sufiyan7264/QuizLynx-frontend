import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './features.html',
    styleUrl: './features.scss'
})
export class Features {
    features = [
        {
            icon: 'pi pi-sparkles',
            title: 'AI-Powered Quiz Generation',
            description: 'Transform any topic into engaging quizzes in seconds. Our AI understands context, difficulty levels, and learning objectives to create questions that truly test understanding.',
            highlights: [
                'Multiple question types: MCQ, True/False, Short Answer',
                'Adjustable difficulty levels',
                'Topic-aware context generation',
                'Bulk generation for courses'
            ]
        },
        {
            icon: 'pi pi-chart-bar',
            title: 'Real-time Analytics Dashboard',
            description: 'Get instant insights into student performance with comprehensive analytics. Track progress, identify weak areas, and make data-driven decisions.',
            highlights: [
                'Individual and batch performance tracking',
                'Question-level analytics',
                'Progress trends over time',
                'Exportable reports'
            ]
        },
        {
            icon: 'pi pi-users',
            title: 'Classroom Management',
            description: 'Create and manage virtual classrooms with ease. Organize students into batches, assign quizzes, and monitor progress all in one place.',
            highlights: [
                'Create unlimited batches',
                'Easy student enrollment via codes',
                'Batch-specific quiz assignments',
                'Student progress monitoring'
            ]
        },
        {
            icon: 'pi pi-trophy',
            title: 'Leaderboards & Gamification',
            description: 'Motivate students through friendly competition. Global and batch-specific leaderboards keep learners engaged and striving for improvement.',
            highlights: [
                'Global and batch leaderboards',
                'Points and streak tracking',
                'Achievement badges',
                'Performance rankings'
            ]
        },
        {
            icon: 'pi pi-clock',
            title: 'Timed Assessments',
            description: 'Create timed quizzes to simulate real exam conditions. Set overall time limits or per-question timers for focused practice.',
            highlights: [
                'Configurable time limits',
                'Auto-submit on timeout',
                'Time tracking per question',
                'Exam simulation mode'
            ]
        },
        {
            icon: 'pi pi-shield',
            title: 'Secure & Private',
            description: 'Your data is protected with industry-standard security. Private batches ensure only invited students can access your quizzes.',
            highlights: [
                'End-to-end encryption',
                'Private batch access control',
                'GDPR compliant',
                'No data selling, ever'
            ]
        }
    ];
}
