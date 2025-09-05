@component('mail::message')
# 🚨 URGENT: Flagged Post Requires HR Attention

Hello {{ $hrEmployee->user->name }},

A flagged post has been waiting for HR response for **{{ $daysSinceCreated }} days**.

@component('mail::panel')
**📋 Post Details:**
- **Post ID:** {{ $flagPost->post_id }}
- **Posted by:** {{ $flagPost->employee->user->username ?? 'Anonymous' }}
- **Reason:** {{ $flagPost->reason }}
- **Flagged on:** {{ $flagPost->created_at->format('M d, Y H:i') }}
- **Days since creation:** {{ $daysSinceCreated }} days
@endcomponent

@component('mail::panel')
**⏰ Time Limit:** If no action is taken within **{{ 6 - $daysSinceCreated }} more days**, 
this post will be automatically escalated to management for review.
@endcomponent

**Next Steps:**
1. Review the flagged post in your HR dashboard
2. Take appropriate action (resolve, investigate, etc.)
3. Update the post status to prevent escalation

@component('mail::button', ['url' => config('app.url') . '/hr/dashboard'])
Go to HR Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent