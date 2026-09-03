import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Link,
} from '@react-email/components';

export interface ContactInquiryData {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: string;
}

interface ContactInquiryEmailProps {
  data: ContactInquiryData;
}

export const ContactInquiryEmail: React.FC<ContactInquiryEmailProps> = ({ data }) => {
  const formattedDate = data.submittedAt || new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>{`📬 New Contact Message from ${data.name}: ${data.subject}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Banner */}
          <Section style={headerBanner}>
            <Text style={badge}>📬 WEBSITE CONTACT INQUIRY</Text>
            <Heading style={headerTitle}>NEW MESSAGE RECEIVED</Heading>
            <Text style={headerSubtitle}>Received via tyliciousgrillz.com contact form</Text>
          </Section>

          {/* Main Card */}
          <Section style={cardSection}>
            {/* Sender Details */}
            <Section style={boxContainer}>
              <Heading as="h3" style={boxTitle}>Sender Information</Heading>
              <Hr style={innerDivider} />
              
              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>NAME:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{data.name}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>EMAIL:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Link href={`mailto:${data.email}`} style={emailLink}>{data.email}</Link>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>SUBJECT:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValueBold}>{data.subject}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>DATE & TIME:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{formattedDate}</Text>
                </Column>
              </Row>
            </Section>

            {/* Message Body */}
            <Section style={messageBox}>
              <Heading as="h3" style={boxTitle}>Message</Heading>
              <Hr style={innerDivider} />
              <Text style={messageContent}>{data.message}</Text>
            </Section>

            {/* Direct Reply CTA Button */}
            <Section style={buttonContainer}>
              <Link href={`mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}`} style={replyButton}>
                Reply to {data.name} ({data.email})
              </Link>
            </Section>

            <Hr style={divider} />

            {/* Footer Notice */}
            <Text style={footerNotice}>
              This notification was automatically routed to <strong>order@tyliciousgrillz.com</strong> from the website contact page.
            </Text>
          </Section>

          <Text style={legalText}>
            Tylicious Grillz Ltd • Meadow Road, DA11 7LR, Gravesend • order@tyliciousgrillz.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactInquiryEmail;

const main: React.CSSProperties = {
  backgroundColor: '#FFF5F3',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0 auto',
  padding: '30px 10px',
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
  border: '2px solid #1A0500',
};

const headerBanner: React.CSSProperties = {
  backgroundColor: '#1A0500',
  padding: '32px 24px',
  textAlign: 'center',
};

const badge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#E63900',
  color: '#FFFFFF',
  padding: '4px 14px',
  borderRadius: '9999px',
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0 0 10px 0',
};

const headerTitle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  margin: '0 0 6px 0',
};

const headerSubtitle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.75)',
  fontSize: '13px',
  margin: '0',
};

const cardSection: React.CSSProperties = {
  padding: '28px 24px',
};

const boxContainer: React.CSSProperties = {
  backgroundColor: '#FFF5F5',
  border: '1px solid #FF8A8A',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '20px',
};

const messageBox: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '24px',
};

const boxTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#1A0500',
  margin: '0 0 10px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const innerDivider: React.CSSProperties = {
  borderColor: 'rgba(0, 0, 0, 0.08)',
  margin: '0 0 14px 0',
};

const infoRow: React.CSSProperties = {
  marginBottom: '8px',
};

const infoLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#666666',
  margin: '0',
};

const infoValue: React.CSSProperties = {
  fontSize: '14px',
  color: '#1A0500',
  margin: '0',
};

const infoValueBold: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#E63900',
  margin: '0',
};

const emailLink: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#E63900',
  textDecoration: 'underline',
};

const messageContent: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#2A0300',
  whiteSpace: 'pre-wrap',
  margin: '0',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '24px',
};

const replyButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#E63900',
  color: '#FFFFFF',
  padding: '14px 28px',
  borderRadius: '9999px',
  fontWeight: '700',
  fontSize: '14px',
  textDecoration: 'none',
  textAlign: 'center',
};

const divider: React.CSSProperties = {
  borderColor: '#E5E7EB',
  margin: '20px 0',
};

const footerNotice: React.CSSProperties = {
  fontSize: '12px',
  color: '#666666',
  textAlign: 'center',
  margin: '0',
};

const legalText: React.CSSProperties = {
  fontSize: '11px',
  color: '#888888',
  textAlign: 'center',
  padding: '16px 20px',
  margin: '0',
};
