<?php $__env->startComponent('mail::message'); ?>
# Welcome to ANON Platform

Hello <?php echo e($user->first_name); ?>,

You have been invited to join the ANON Platform. Please click the button below to activate your account and set your password.

<?php $__env->startComponent('mail::button', ['url' => $url]); ?>
Activate Account
<?php echo $__env->renderComponent(); ?>

If you're having trouble clicking the "Activate Account" button, copy and paste the URL below into your web browser:

<?php echo e($url); ?>


Thanks,<br>
<?php echo e(config('app.name')); ?>

<?php echo $__env->renderComponent(); ?>
<?php /**PATH /var/www/backend/resources/views/mail/users/signup.blade.php ENDPATH**/ ?>