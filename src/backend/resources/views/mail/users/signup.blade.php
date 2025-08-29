@component('mail::message')
# Welcome to ANON Platform

Hello {{ $user->first_name }},

You have been invited to join the ANON Platform. Please click the button below to activate your account and set your password.

@component('mail::button', ['url' => $url])
Activate Account
@endcomponent

If you're having trouble clicking the "Activate Account" button, copy and paste the URL below into your web browser:

{{ $url }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
