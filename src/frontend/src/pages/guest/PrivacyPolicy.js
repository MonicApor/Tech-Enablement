import { Container, List, ListItem } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import Heading from 'components/atoms/Heading';
import PageTitle from 'components/atoms/PageTitle';

function PrivacyPolicy() {
  const APP_NAME = 'React Base Template';
  const SITE_URL = 'http://localhost';

  return (
    <Container maxWidth="lg" sx={{ pt: 8 }}>
      <PageTitle title="Privacy Policy" />

      <BodyText>
        At {APP_NAME}, accessible from {SITE_URL}, one of our main priorities is the privacy of our
        visitors. This Privacy Policy document contains types of information that is collected and
        recorded by {APP_NAME} and how we use it.
      </BodyText>
      <BodyText>
        If you have additional questions or require more information about our Privacy Policy, do
        not hesitate to contact us.
      </BodyText>
      <BodyText>
        This Privacy Policy applies only to our online activities and is valid for visitors to our
        website with regards to the information that they shared and/or collect in {APP_NAME}. This
        policy is not applicable to any information collected offline or via channels other than
        this website.
      </BodyText>
      <Heading variant="h6">Consent</Heading>
      <BodyText>
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      </BodyText>
      <Heading variant="h6">Information we collect</Heading>
      <BodyText>
        The personal information that you are asked to provide, and the reasons why you are asked to
        provide it, will be made clear to you at the point we ask you to provide your personal
        information.
      </BodyText>
      <BodyText>
        If you contact us directly, we may receive additional information about you such as your
        name, email address, phone number, the contents of the message and/or attachments you may
        send us, and any other information you may choose to provide.
      </BodyText>
      <BodyText>
        When you register for an Account, we may ask for your contact information, including items
        such as name, company name, address, email address, and telephone number.
      </BodyText>
      <Heading variant="h6">How we use your information</Heading>
      <BodyText>We use the information we collect in various ways, including to:</BodyText>
      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Provide, operate, and maintain our website
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Improve, personalize, and expand our website
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Understand and analyze how you use our website
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Develop new products, services, features, and functionality
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Communicate with you, either directly or through one of our partners, including for
          customer service, to provide you with updates and other information relating to the
          website, and for marketing and promotional purposes
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>Send you emails</ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Find and prevent fraud
        </ListItem>
      </List>
      <Heading variant="h6">Log Files</Heading>
      <BodyText>
        {APP_NAME} follows a standard procedure of using log files. These files log visitors when
        they visit websites. All hosting companies do this and a part of hosting services&apos;
        analytics. The information collected by log files include internet protocol (IP) addresses,
        browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages,
        and possibly the number of clicks. These are not linked to any information that is
        personally identifiable. The purpose of the information is for analyzing trends,
        administering the site, tracking users&apos; movement on the website, and gathering
        demographic information.
      </BodyText>
      <Heading variant="h6">Cookies and Web Beacons</Heading>
      <BodyText>
        Like any other website, {APP_NAME} uses &lsquo;cookies&rsquo;. These cookies are used to
        store information including visitors&apos; preferences, and the pages on the website that
        the visitor accessed or visited. The information is used to optimize the users&apos;
        experience by customizing our web page content based on visitors&apos; browser type and/or
        other information.
      </BodyText>
      <Heading variant="h6">Advertising Partners Privacy Policies</Heading>
      <BodyText>
        You may consult this list to find the Privacy Policy for each of the advertising partners of
        {APP_NAME}.
      </BodyText>
      <BodyText>
        Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web
        Beacons that are used in their respective advertisements and links that appear on {APP_NAME}
        , which are sent directly to users&apos; browser. They automatically receive your IP address
        when this occurs. These technologies are used to measure the effectiveness of their
        advertising campaigns and/or to personalize the advertising content that you see on websites
        that you visit.
      </BodyText>
      <BodyText>
        Note that {APP_NAME} has no access to or control over these cookies that are used by
        third-party advertisers.
      </BodyText>
      <Heading variant="h6">Third Party Privacy Policies</Heading>
      <BodyText>
        {APP_NAME}&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we
        are advising you to consult the respective Privacy Policies of these third-party ad servers
        for more detailed information. It may include their practices and instructions about how to
        opt-out of certain options.{' '}
      </BodyText>
      <BodyText>
        You can choose to disable cookies through your individual browser options. To know more
        detailed information about cookie management with specific web browsers, it can be found at
        the browsers&apos; respective websites.
      </BodyText>
      <Heading variant="h6">CCPA Privacy Rights (Do Not Sell My Personal Information)</Heading>
      <BodyText>
        Under the CCPA, among other rights, California consumers have the right to:
      </BodyText>
      <BodyText>
        Request that a business that collects a consumer&apos;s personal data disclose the
        categories and specific pieces of personal data that a business has collected about
        consumers.
      </BodyText>
      <BodyText>
        Request that a business delete any personal data about the consumer that a business has
        collected.
      </BodyText>
      <BodyText>
        Request that a business that sells a consumer&apos;s personal data, not sell the
        consumer&apos;s personal data.
      </BodyText>
      <BodyText>
        If you make a request, we have one month to respond to you. If you would like to exercise
        any of these rights, please contact us.
      </BodyText>
      <Heading variant="h6">GDPR Data Protection Rights</Heading>
      <BodyText>
        We would like to make sure you are fully aware of all of your data protection rights. Every
        user is entitled to the following:
      </BodyText>
      <BodyText>
        The right to access – You have the right to request copies of your personal data. We may
        charge you a small fee for this service.
      </BodyText>
      <BodyText>
        The right to rectification – You have the right to request that we correct any information
        you believe is inaccurate. You also have the right to request that we complete the
        information you believe is incomplete.
      </BodyText>
      <BodyText>
        The right to erasure – You have the right to request that we erase your personal data, under
        certain conditions.
      </BodyText>
      <BodyText>
        The right to restrict processing – You have the right to request that we restrict the
        processing of your personal data, under certain conditions.
      </BodyText>
      <BodyText>
        The right to object to processing – You have the right to object to our processing of your
        personal data, under certain conditions.
      </BodyText>
      <BodyText>
        The right to data portability – You have the right to request that we transfer the data that
        we have collected to another organization, or directly to you, under certain conditions.
      </BodyText>
      <BodyText>
        If you make a request, we have one month to respond to you. If you would like to exercise
        any of these rights, please contact us.
      </BodyText>
      <Heading variant="h6">Children&apos;s Information</Heading>
      <BodyText>
        Another part of our priority is adding protection for children while using the internet. We
        encourage parents and guardians to observe, participate in, and/or monitor and guide their
        online activity.
      </BodyText>
      <BodyText>
        {APP_NAME} does not knowingly collect any Personal Identifiable Information from children
        under the age of 13. If you think that your child provided this kind of information on our
        website, we strongly encourage you to contact us immediately and we will do our best efforts
        to promptly remove such information from our records.
      </BodyText>
    </Container>
  );
}

export default PrivacyPolicy;
