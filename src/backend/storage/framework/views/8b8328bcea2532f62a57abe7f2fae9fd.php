<?php $__env->startComponent('mail::message'); ?>
# 🚨 URGENT: Flagged Post Requires HR Attention

Hello <?php echo e($hrEmployee->user->name); ?>,

A flagged post has been waiting for HR response for **<?php echo e($daysSinceCreated); ?> days**.

<?php $__env->startComponent('mail::panel'); ?>
**📋 Post Details:**
- **Post ID:** <?php echo e($flagPost->post_id); ?>

- **Posted by:** <?php echo e($flagPost->employee->user->username ?? 'Anonymous'); ?>

- **Reason:** <?php echo e($flagPost->reason); ?>

- **Flagged on:** <?php echo e($flagPost->created_at->format('M d, Y H:i')); ?>

- **Days since creation:** <?php echo e($daysSinceCreated); ?> days
<?php echo $__env->renderComponent(); ?>

<?php $__env->startComponent('mail::panel'); ?>
**⏰ Time Limit:** If no action is taken within **<?php echo e(6 - $daysSinceCreated); ?> more days**, 
this post will be automatically escalated to management for review.
<?php echo $__env->renderComponent(); ?>

**Next Steps:**
1. Review the flagged post in your HR dashboard
2. Take appropriate action (resolve, investigate, etc.)
3. Update the post status to prevent escalation

<?php $__env->startComponent('mail::button', ['url' => config('app.url') . '/hr/dashboard']); ?>
Go to HR Dashboard
<?php echo $__env->renderComponent(); ?>

Thanks,<br>
<?php echo e(config('app.name')); ?>

<?php echo $__env->renderComponent(); ?><?php /**PATH /var/www/backend/resources/views/mail/users/flag-post-reminder.blade.php ENDPATH**/ ?>