const en = {
  translation: {
    // define translations below
    form: {
      required: 'This field is required.',
      email: 'The email format is invalid.',
      password: {
        minLength: 'Password must be at least 8 characters.',
        confirm: 'Password confirmation does not match.',
        strong:
          'Password must contain the following: 1 uppercase, 1 special character and a minimum of 8 characters.',
      },
    },
    labels: {
      first_name: 'First Name',
      last_name: 'Last Name',
      login: 'Login',
      signup: 'Signup',
      remember_me: 'Remember Me',
      forgot_password: 'Forgot Password?',
      email_address: 'Email Address',
      password: 'Password',
      confirm_password: 'Confirm Password',
      submit: 'Submit',
      update: 'Update',
      save: 'Save',
      add_new: 'Add New',
      reset_password: 'Reset Password',
      new_password: 'New Password',
      confirm_new_password: 'Confirm New Password',
      enter_keyword: 'Enter Keyword',
      get_started: 'Get Started',
      integrations: 'Integrations',
      settings: 'Settings',
      documentation: 'Documentation',
      fullname: 'Fullname',
      inquiry_content: 'Inquiry Content',
      navigation: 'Navigation',
      resources: 'Resources',
      cancel: 'Cancel',
      action: 'Action',
      showPassword: 'Show Password',
      hidePassword: 'Hide Password',
      role: 'Role',
      notifications: 'Notifications',
      noNotifications: 'No new notifications.',
      newNotification: 'You have a new notification.',
    },
    pages: {
      login: {
        no_account: "Don't have an account?",
        sign_up_here: 'Sign up here',
      },
      signup: {
        agree_to_terms: 'By clicking Register, you agree that you have read and agree to the',
        signup_complete:
          'A confirmation email has been sent to your inbox. Click the link to complete the registration process.',
        terms_conditions: 'Terms & Conditions',
        create_free_account: 'Create your Free Account',
        signup_description: 'Join thousands of employees sharing feedback anonymously',
        already_have_account: 'Already have an account?',
        sign_in_here: 'Sign in here',
      },
      forgot_password: {
        sub_heading: 'To recover your account, please enter your email address below.',
        success: 'Check your inbox for instructions on how to reset your password.',
      },
      reset_password: {
        sub_heading: 'Please enter your new password.',
        success: 'The password has been updated successfully.',
      },
      users: {
        user_created: 'The user has been created.',
        user_updated: 'User details have been updated.',
        user_deleted: 'User has been deleted.',
        add_user: 'Add User',
        edit_user: 'Edit User',
        delete_user: 'Delete user',
        first_name: 'First Name',
        last_name: 'Last Name',
        email_address: 'Email Address',
        status: 'Status',
        role: 'Role',
        delete_confirmation: 'Are you sure you want to delete the selected user?',
      },
      activate: {
        heading: 'Activate Account',
        subtitle: 'Set your password to activate your account.',
        activated: 'Your Account has been activated. You can now login to your account!',
      },
      dashboard: {
        main_heading: 'Anonymous Employee Feedback!',
        sub_heading: 'A lightweight boilerplate about the development of a React project.',
        new_users: 'New Users',
        total_sales: 'Total Sales',
        total_orders: 'Total Orders',
      },
      not_found: {
        title: 'Page Not Found',
        sub_heading:
          'The page you are looking for may have been deleted or moved to another location.',
        back_to_top: 'Back to Top Page',
      },
      faq: {
        heading: 'FAQ',
        sub_heading: 'We have summarized the questions that customers inquire in a Q&A format.',
      },
      inquiry: {
        heading: 'Inquiry',
        sub_heading: 'If you would like to contact us, please fill out the form below.',
        success_message: 'Your inquiry has been sent.',
        failed_message: 'An error occurred while sending.',
      },
      profile: {
        heading: 'Edit Profile',
        sub_heading: 'Update your account information.',
        success_message: 'Details has been updated successfully.',
        failed_message: 'The update failed.',
      },
      landing: {
        main_heading: 'Anonymous Employee Feedback!',
        sub_heading:
          'Create a culture of open communication where every voice matters. Share feedback safely and anonymously',
        why_heading: 'Why Choose Anon?',
        docker: {
          heading: 'Complete Anonymity',
          description:
            'Your identity is protected. Share feedback without fear of retaliation or judgment.',
        },
        react: {
          heading: 'Real-time Feedback',
          description:
            'Post and respond to feedback instantly. Create meaningful workplace conversations.',
        },
        laravel: {
          heading: 'Actionable Insights',
          description:
            'Transform anonymous feedback into actionable improvements for your organization.',
        },
        our_customers_heading: 'Our Clients',
        reviews_heading: 'What our clients say',
        see_all_reviews: 'See All Reviews',
        call_to_action: 'Ready to Transform Your Workplace?',
        call_to_action_description:
          'Join thousands of organizations creating better workplace cultures through anonymous feedback.',
        call_to_action_button: 'Start Free Today',
      },
      about: {
        main_heading: 'Our Story',
        sub_heading:
          'We work together to design, create and produce works that we are proud of for those we believe in.',
        meet_the_team: 'Meet the team',
        team_description:
          'Thoughtfulness, originality, and attention to detail are the basis for every product we design, build, and market.',
        our_mission: 'Our Mission',
        mission_description:
          'Our mission is to spread the excellence of technology with quality service and products valuing the business trend and proposition with people centric culture and behavior. We are a team of passionate individuals who are dedicated to making the world a better place.',
        our_activities: 'Our Activities',
        activities_description: 'Never get so busy making a living that you forget to make a life.',
      },
      roles: {
        role_created: 'The role has been created.',
        role_updated: 'Role details have been updated.',
        role_deleted: 'Role has been deleted.',
        add_role: 'Add Role',
        edit_role: 'Edit Role',
        delete_role: 'Delete Role',
        name: 'Name',
        permissions: 'Permissions',
        delete_confirmation: 'Are you sure you want to delete the selected role?',
      },
      unauthorized: {
        main_heading: 'Unauthorized',
        sub_heading: 'Sorry, you do not have permission to access this resource.',
      },
    },
    menu: {
      home: 'Home',
      about: 'About',
      inquiry: 'Inquiry',
      faq: 'FAQ',
      dashboard: 'Dashboard',
      users: 'Users',
      orders: 'Orders',
      reports: 'Reports',
      integrations: 'Integrations',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
      terms: 'Terms of Service',
      privacy_policy: 'Privacy Policy',
      documentation: 'Documentation',
      api_reference: 'API Reference',
      support: 'Documentation',
      styleguide: 'Styleguide',
      roles: 'Roles',
      broadcast: 'Broadcast',
      'create-post': 'Create Post',
      'my-posts': 'My Posts',
      notifications: 'Notifications',
      'my-upvotes': 'My UpVotes',
      settings: 'Settings',
      quick_links: 'Quick Links',
    },
    sidebar: {
      employee: 'Employee Sidebar',
    },
    table: {
      no_data: 'No data.',
    },
  },
};

export default en;
