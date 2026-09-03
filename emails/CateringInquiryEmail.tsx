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

export interface CateringInquiryData {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string | number;
  address?: string;
  staffing?: string;
  selectedMenu?: string[];
  specialNotes?: string;
  submittedAt?: string;
}

interface CateringInquiryEmailProps {
  data: CateringInquiryData;
}

export const CateringInquiryEmail: React.FC<CateringInquiryEmailProps> = ({ data }) => {
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
      <Preview>{`🍖 New Catering Inquiry from ${data.name} for ${data.date} (${data.guests} guests)`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Banner */}
          <Section style={headerBanner}>
            <Text style={badge}>🍖 CATERING & EVENT INQUIRY</Text>
            <Heading style={headerTitle}>NEW CATERING REQUEST</Heading>
            <Text style={headerSubtitle}>Event Date: <strong>{data.date}</strong> • Guests: <strong>{data.guests}</strong></Text>
          </Section>

          {/* Main Card */}
          <Section style={cardSection}>
            {/* Client Contact Info */}
            <Section style={boxContainer}>
              <Heading as="h3" style={boxTitle}>Client Information</Heading>
              <Hr style={innerDivider} />

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>CLIENT NAME:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValueBold}>{data.name}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>EMAIL ADDRESS:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Link href={`mailto:${data.email}`} style={emailLink}>{data.email}</Link>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>PHONE NUMBER:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Link href={`tel:${data.phone}`} style={phoneLink}>{data.phone}</Link>
                </Column>
              </Row>
            </Section>

            {/* Event Specification Box */}
            <Section style={eventBoxContainer}>
              <Heading as="h3" style={boxTitle}>Event Specifications</Heading>
              <Hr style={innerDivider} />

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>EVENT DATE:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoHighlight}>{data.date}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>ESTIMATED GUESTS:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValueBold}>{data.guests} guests</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>SERVICE STYLE:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{data.staffing || 'Not specified'}</Text>
                </Column>
              </Row>

              {data.address && (
                <Row style={infoRow}>
                  <Column style={{ width: '35%' }}>
                    <Text style={infoLabel}>VENUE / ADDRESS:</Text>
                  </Column>
                  <Column style={{ width: '65%' }}>
                    <Text style={infoValue}>{data.address}</Text>
                  </Column>
                </Row>
              )}

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>SUBMITTED ON:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{formattedDate}</Text>
                </Column>
              </Row>
            </Section>

            {/* Selected Menu Items */}
            {data.selectedMenu && data.selectedMenu.length > 0 && (
              <Section style={menuBoxContainer}>
                <Heading as="h3" style={boxTitle}>Preferred Menu Selections</Heading>
                <Hr style={innerDivider} />
                <Row>
                  <Column>
                    {data.selectedMenu.map((item, idx) => (
                      <Text key={idx} style={menuItemBadge}>
                        🔥 {item}
                      </Text>
                    ))}
                  </Column>
                </Row>
              </Section>
            )}

            {/* Special Dietary & Setup Notes */}
            {data.specialNotes && (
              <Section style={notesBoxContainer}>
                <Heading as="h3" style={boxTitle}>Special Notes & Dietary Requirements</Heading>
                <Hr style={innerDivider} />
                <Text style={notesContent}>{data.specialNotes}</Text>
              </Section>
            )}

            {/* Quick Actions */}
            <Section style={buttonContainer}>
              <Link
                href={`mailto:${data.email}?subject=${encodeURIComponent(`Tylicious Grillz Catering Quote - ${data.date}`)}`}
                style={replyButton}
              >
                Reply with Quote to {data.name}
              </Link>
            </Section>

            <Hr style={divider} />

            <Text style={footerNotice}>
              This catering request was automatically routed to <strong>order@tyliciousgrillz.com</strong> from the website catering page.
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

export default CateringInquiryEmail;

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
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '14px',
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

const eventBoxContainer: React.CSSProperties = {
  backgroundColor: '#FFF9F6',
  border: '1px solid #FFC2A8',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '20px',
};

const menuBoxContainer: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '20px',
};

const notesBoxContainer: React.CSSProperties = {
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
  color: '#1A0500',
  margin: '0',
};

const infoHighlight: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: '800',
  color: '#E63900',
  margin: '0',
};

const emailLink: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#E63900',
  textDecoration: 'underline',
};

const phoneLink: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1A0500',
  textDecoration: 'none',
};

const menuItemBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#FFF5F3',
  color: '#1A0500',
  border: '1px solid #FF8A8A',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  margin: '4px 6px 4px 0',
};

const notesContent: React.CSSProperties = {
  fontSize: '14px',
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
