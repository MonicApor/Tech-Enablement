@component('mail::message')
# 🚨 ESCALATED: Post Requires Management Review

Hello {{ $manager->user->name }},

A flagged post has been automatically escalated to management after being ignored by HR for **{{ $daysSinceCreated }} days**.

@component('mail::panel')
**📋 Escalated Post Details:**
- **Post ID:** {{ $flagPost->post_id }}
- **Flagged by:** {{ $flagPost->employee->user->username ?? 'Anonymous' }}
- **Reason:** {{ $flagPost->reason }}
- **Flagged on:** {{ $flagPost->created_at->format('M d, Y H:i') }}
- **Escalated on:** {{ $flagPost->escalated_at ? $flagPost->escalated_at->format('M d, Y H:i') : 'Just now' }}
- **Days since creation:** {{ $daysSinceCreated }} days
@endcomponent

@component('mail::panel')
**🎯 Management Action Required:**
- Review the escalated post immediately
- Take appropriate management action
- Investigate why HR did not respond
- Update the escalation status
@endcomponent

**HR Performance Note:** This escalation indicates that HR failed to respond 
to a flagged post within the required 3-day timeframe. Please review HR response procedures.

@component('mail::button', ['url' => config('app.url') . '/admin/escalations'])
Go to Management Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent