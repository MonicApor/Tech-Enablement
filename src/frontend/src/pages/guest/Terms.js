import { Container, List, ListItem } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import Heading from 'components/atoms/Heading';
import PageTitle from 'components/atoms/PageTitle';

function Terms() {
  const APP_NAME = process.env.REACT_APP_SITE_TITLE;
  const SITE_URL = window.location.host;

  return (
    <Container maxWidth="lg" sx={{ pt: 8 }}>
      <PageTitle title={'Terms and Conditions'} />

      <BodyText>
        These terms and conditions outline the rules and regulations for the use of {APP_NAME}&#39;s
        Website, located at {SITE_URL}.
      </BodyText>

      <BodyText>
        By accessing this website we assume you accept these terms and conditions. Do not continue
        to use {APP_NAME} if you do not agree to take all of the terms and conditions stated on this
        page.
      </BodyText>

      <BodyText>
        The following terminology applies to these Terms and Conditions, Privacy Statement and
        Disclaimer Notice and all Agreements: &quot;Client&quot;, &quot;You&quot; and
        &quot;Your&quot; refers to you, the person log on this website and compliant to the
        Company&#39;s terms and conditions. &quot;The Company&quot;, &quot;Ourselves&quot;,
        &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our Company.
        &quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and
        ourselves. All terms refer to the offer, acceptance and consideration of payment necessary
        to undertake the process of our assistance to the Client in the most appropriate manner for
        the express purpose of meeting the Client&#39;s needs in respect of provision of the
        Company&#39;s stated services, in accordance with and subject to, prevailing law of
        Netherlands. Any use of the above terminology or other words in the singular, plural,
        capitalization and/or he/she or they, are taken as interchangeable and therefore as
        referring to same.
      </BodyText>

      <Heading variant="h5">Cookies</Heading>

      <BodyText>
        We employ the use of cookies. By accessing {APP_NAME}, you agreed to use cookies in
        agreement with the {APP_NAME}&#39;s Privacy Policy.
      </BodyText>

      <BodyText>
        Most interactive websites use cookies to let us retrieve the user&#39;s details for each
        visit. Cookies are used by our website to enable the functionality of certain areas to make
        it easier for people visiting our website. Some of our affiliate/advertising partners may
        also use cookies.
      </BodyText>

      <Heading variant="h5">License</Heading>

      <BodyText>
        Unless otherwise stated, {APP_NAME} and/or its licensors own the intellectual property
        rights for all material on {APP_NAME}. All intellectual property rights are reserved. You
        may access this from {APP_NAME} for your own personal use subjected to restrictions set in
        these terms and conditions.
      </BodyText>

      <BodyText>You must not:</BodyText>
      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Republish material from {APP_NAME}
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Sell, rent or sub-license material from {APP_NAME}
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Reproduce, duplicate or copy material from {APP_NAME}
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Redistribute content from {APP_NAME}
        </ListItem>
      </List>

      <BodyText>This Agreement shall begin on the date hereof.</BodyText>

      <BodyText>
        Parts of this website offer an opportunity for users to post and exchange opinions and
        information in certain areas of the website. {APP_NAME} does not filter, edit, publish or
        review Comments prior to their presence on the website. Comments do not reflect the views
        and opinions of {APP_NAME},its agents and/or affiliates. Comments reflect the views and
        opinions of the person who post their views and opinions. To the extent permitted by
        applicable laws, {APP_NAME} shall not be liable for the Comments or for any liability,
        damages or expenses caused and/or suffered as a result of any use of and/or posting of
        and/or appearance of the Comments on this website.
      </BodyText>

      <BodyText>
        {APP_NAME} reserves the right to monitor all Comments and to remove any Comments which can
        be considered inappropriate, offensive or causes breach of these Terms and Conditions.
      </BodyText>

      <BodyText>You warrant and represent that:</BodyText>

      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          You are entitled to post the Comments on our website and have all necessary licenses and
          consents to do so;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          The Comments do not invade any intellectual property right, including without limitation
          copyright, patent or trademark of any third party;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise
          unlawful material which is an invasion of privacy
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          The Comments will not be used to solicit or promote business or custom or present
          commercial activities or unlawful activity.
        </ListItem>
      </List>

      <BodyText>
        You hereby grant {APP_NAME} a non-exclusive license to use, reproduce, edit and authorize
        others to use, reproduce and edit any of your Comments in any and all forms, formats or
        media.
      </BodyText>

      <Heading variant="h5">Hyperlinking to our Content</Heading>

      <BodyText>
        The following organizations may link to our Website without prior written approval:
      </BodyText>

      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Government agencies;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>Search engines;</ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          News organizations;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          Online directory distributors may link to our Website in the same manner as they hyperlink
          to the Websites of other listed businesses; and
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          System wide Accredited Businesses except soliciting non-profit organizations, charity
          shopping malls, and charity fundraising groups which may not hyperlink to our Web site.
        </ListItem>
      </List>

      <BodyText>
        These organizations may link to our home page, to publications or to other Website
        information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply
        sponsorship, endorsement or approval of the linking party and its products and/or services;
        and (c) fits within the context of the linking party&#39;s site.
      </BodyText>

      <BodyText>
        We may consider and approve other link requests from the following types of organizations:
      </BodyText>

      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          commonly-known consumer and/or business information sources;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          dot.com community sites;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          associations or other groups representing charities;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          online directory distributors;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          internet portals;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          accounting, law and consulting firms; and
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          educational institutions and trade associations.
        </ListItem>
      </List>

      <BodyText>
        We will approve link requests from these organizations if we decide that: (a) the link would
        not make us look unfavorably to ourselves or to our accredited businesses; (b) the
        organization does not have any negative records with us; (c) the benefit to us from the
        visibility of the hyperlink compensates the absence of {APP_NAME}; and (d) the link is in
        the context of general resource information.
      </BodyText>

      <BodyText>
        These organizations may link to our home page so long as the link: (a) is not in any way
        deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking
        party and its products or services; and (c) fits within the context of the linking
        party&#39;s site.
      </BodyText>

      <BodyText>
        If you are one of the organizations listed in paragraph 2 above and are interested in
        linking to our website, you must inform us by sending an e-mail to {APP_NAME}. Please
        include your name, your organization name, contact information as well as the URL of your
        site, a list of any URLs from which you intend to link to our Website, and a list of the
        URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
      </BodyText>

      <BodyText>Approved organizations may hyperlink to our Website as follows:</BodyText>

      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          By use of our corporate name; or
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          By use of the uniform resource locator being linked to; or
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          By use of any other description of our Website being linked to that makes sense within the
          context and format of content on the linking party&#39;s site.
        </ListItem>
      </List>

      <BodyText>
        No use of {APP_NAME}&#39;s logo or other artwork will be allowed for linking absent a
        trademark license agreement.
      </BodyText>

      <Heading variant="h5">iFrames</Heading>

      <BodyText>
        Without prior approval and written permission, you may not create frames around our Webpages
        that alter in any way the visual presentation or appearance of our Website.
      </BodyText>

      <Heading variant="h5">Content Liability</Heading>

      <BodyText>
        We shall not be hold responsible for any content that appears on your Website. You agree to
        protect and defend us against all claims that is rising on your Website. No link(s) should
        appear on any Website that may be interpreted as libelous, obscene or criminal, or which
        infringes, otherwise violates, or advocates the infringement or other violation of, any
        third party rights.
      </BodyText>

      <Heading variant="h5">Your Privacy</Heading>

      <BodyText>Please read Privacy Policy</BodyText>

      <Heading variant="h5">Reservation of Rights</Heading>

      <BodyText>
        We reserve the right to request that you remove all links or any particular link to our
        Website. You approve to immediately remove all links to our Website upon request. We also
        reserve the right to amen these terms and conditions and it&#39;s linking policy at any
        time. By continuously linking to our Website, you agree to be bound to and follow these
        linking terms and conditions.
      </BodyText>

      <Heading variant="h5">Removal of links from our website</Heading>

      <BodyText>
        If you find any link on our Website that is offensive for any reason, you are free to
        contact and inform us any moment. We will consider requests to remove links but we are not
        obligated to or so or to respond to you directly.
      </BodyText>

      <BodyText>
        We do not ensure that the information on this website is correct, we do not warrant its
        completeness or accuracy; nor do we promise to ensure that the website remains available or
        that the material on the website is kept up to date.
      </BodyText>

      <Heading variant="h5">Disclaimer</Heading>

      <BodyText>
        To the maximum extent permitted by applicable law, we exclude all representations,
        warranties and conditions relating to our website and the use of this website. Nothing in
        this disclaimer will:
      </BodyText>

      <List sx={{ listStyle: 'disc', pl: 4 }}>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          limit or exclude our or your liability for death or personal injury;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          limit or exclude our or your liability for fraud or fraudulent misrepresentation;
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          limit any of our or your liabilities in any way that is not permitted under applicable
          law; or
        </ListItem>
        <ListItem sx={{ fontSize: 14, m: 0, p: 0, display: 'list-item' }}>
          exclude any of our or your liabilities that may not be excluded under applicable law.
        </ListItem>
      </List>

      <BodyText>
        The limitations and prohibitions of liability set in this Section and elsewhere in this
        disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities
        arising under the disclaimer, including liabilities arising in contract, in tort and for
        breach of statutory duty.
      </BodyText>

      <BodyText>
        As long as the website and the information and services on the website are provided free of
        charge, we will not be liable for any loss or damage of any nature.
      </BodyText>
    </Container>
  );
}

export default Terms;
