<?php $__env->startComponent('mail::message'); ?>
# 🚨 ESCALATED: Post Requires Management Review

Hello <?php echo e($manager->user->name); ?>,

A flagged post has been automatically escalated to management after being ignored by HR for **<?php echo e($daysSinceCreated); ?> days**.

<?php $__env->startComponent('mail::panel'); ?>
**📋 Escalated Post Details:**
- **Post ID:** <?php echo e($flagPost->post_id); ?>

- **Flagged by:** <?php echo e($flagPost->employee->user->username ?? 'Anonymous'); ?>

- **Reason:** <?php echo e($flagPost->reason); ?>

- **Flagged on:** <?php echo e($flagPost->created_at->format('M d, Y H:i')); ?>

- **Escalated on:** <?php echo e($flagPost->escalated_at ? $flagPost->escalated_at->format('M d, Y H:i') : 'Just now'); ?>

- **Days since creation:** <?php echo e($daysSinceCreated); ?> days
<?php echo $__env->renderComponent(); ?>

<?php $__env->startComponent('mail::panel'); ?>
**🎯 Management Action Required:**
- Review the escalated post immediately
- Take appropriate management action
- Investigate why HR did not respond
- Update the escalation status
<?php echo $__env->renderComponent(); ?>

**HR Performance Note:** This escalation indicates that HR failed to respond 
to a flagged post within the required 3-day timeframe. Please review HR response procedures.

<?php $__env->startComponent('mail::button', ['url' => config('app.url') . '/admin/escalations']); ?>
Go to Management Dashboard
<?php echo $__env->renderComponent(); ?>

Thanks,<br>
<?php echo e(config('app.name')); ?>

<?php echo $__env->renderComponent(); ?><?php /**PATH /var/www/backend/resources/views/mail/users/post-escalated.blade.php ENDPATH**/ ?>