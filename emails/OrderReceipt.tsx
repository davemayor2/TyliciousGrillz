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

export interface OrderItemData {
  id?: string | number;
  product_id?: string | number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  options?: Record<string, { name: string; price: number }[]> | { spice_level?: string; sides?: string[]; special_notes?: string };
}

export interface OrderData {
  id: string | number;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_address?: string | null;
  fulfillment_method?: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status?: string | null;
  order_status?: string | null;
  created_at?: string | null;
  stripe_session_id?: string | null;
}

interface OrderReceiptProps {
  order: OrderData;
  order_items: OrderItemData[];
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, order_items = [] }) => {
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-GB');

  return (
    <Html>
      <Head />
      <Preview>{`Your Tylicious Grillz order #${order.id} is confirmed! 🔥`}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header Banner */}
          <Section style={headerSection}>
            <Heading style={headerTitle}>TYLICIOUS GRILLZ</Heading>
            <Text style={headerSubtitle}>Authentic African Flame-Grilled Feasts</Text>
          </Section>

          {/* Main Card Content */}
          <Section style={contentSection}>
            <Heading as="h2" style={orderGreeting}>
              Thank you for your order, {order.customer_name || 'Food Lover'}! 🎉
            </Heading>
            <Text style={orderIntro}>
              We have received your payment and our master grillers are preparing your sizzle.
            </Text>

            {/* Order Meta Box */}
            <Section style={metaBox}>
              <Row>
                <Column style={{ width: '50%' }}>
                  <Text style={metaLabel}>ORDER NUMBER</Text>
                  <Text style={metaValue}>#{order.id}</Text>
                </Column>
                <Column style={{ width: '50%' }}>
                  <Text style={metaLabel}>DATE</Text>
                  <Text style={metaValue}>{formattedDate}</Text>
                </Column>
              </Row>
              <Row style={{ marginTop: '12px' }}>
                <Column style={{ width: '50%' }}>
                  <Text style={metaLabel}>FULFILLMENT</Text>
                  <Text style={metaValue}>{order.fulfillment_method || 'Delivery'}</Text>
                </Column>
                <Column style={{ width: '50%' }}>
                  <Text style={metaLabel}>STATUS</Text>
                  <Text style={{ ...metaValue, color: '#00875A', fontWeight: 'bold' }}>
                    PAID & CONFIRMED
                  </Text>
                </Column>
              </Row>
              {order.delivery_address && (
                <Row style={{ marginTop: '12px' }}>
                  <Column style={{ width: '100%' }}>
                    <Text style={metaLabel}>DELIVERY ADDRESS</Text>
                    <Text style={metaValue}>{order.delivery_address}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Items Table */}
            <Section style={itemsSection}>
              <Heading as="h3" style={sectionTitle}>
                Order Summary
              </Heading>
              <Hr style={divider} />

              {order_items.map((item, index) => {
                // Extract formatted options summary
                const optionsSummary: string[] = [];
                if (item.options) {
                  if (typeof item.options === 'object' && !('spice_level' in item.options)) {
                    Object.entries(item.options).forEach(([cat, vals]) => {
                      if (Array.isArray(vals)) {
                        optionsSummary.push(`${cat}: ${vals.map((v) => v.name).join(', ')}`);
                      }
                    });
                  } else {
                    const opt = item.options as { spice_level?: string; sides?: string[]; special_notes?: string };
                    if (opt.spice_level) optionsSummary.push(`Spice: ${opt.spice_level}`);
                    if (opt.sides && opt.sides.length) optionsSummary.push(`Sides: ${opt.sides.join(', ')}`);
                    if (opt.special_notes) optionsSummary.push(`Notes: ${opt.special_notes}`);
                  }
                }

                return (
                  <div key={index} style={itemRow}>
                    <Row>
                      <Column style={{ width: '70%' }}>
                        <Text style={itemName}>
                          {item.product_name} <span style={itemQty}>× {item.quantity}</span>
                        </Text>
                        {optionsSummary.length > 0 && (
                          <Text style={itemOptions}>{optionsSummary.join(' • ')}</Text>
                        )}
                      </Column>
                      <Column style={{ width: '30%', textAlign: 'right' }}>
                        <Text style={itemPrice}>£{Number(item.total).toFixed(2)}</Text>
                      </Column>
                    </Row>
                    <Hr style={itemDivider} />
                  </div>
                );
              })}

              {/* Price Breakdown */}
              <Section style={summarySection}>
                <Row style={summaryRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={summaryLabel}>Subtotal</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text style={summaryValue}>£{Number(order.subtotal).toFixed(2)}</Text>
                  </Column>
                </Row>
                <Row style={summaryRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={summaryLabel}>Delivery Fee</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text style={summaryValue}>£{Number(order.delivery_fee).toFixed(2)}</Text>
                  </Column>
                </Row>
                <Hr style={divider} />
                <Row style={{ marginTop: '8px' }}>
                  <Column style={{ width: '70%' }}>
                    <Text style={grandTotalLabel}>Grand Total</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text style={grandTotalValue}>£{Number(order.total).toFixed(2)}</Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Need Help Box */}
            <Section style={helpBox}>
              <Text style={helpText}>
                Need to amend your order or have questions? Contact us at{' '}
                <Link href="tel:+447000000000" style={helpLink}>
                  our customer support
                </Link>{' '}
                or reply directly to this email.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Tylicious Grillz. All rights reserved.
            </Text>
            <Text style={footerSubtext}>
              Freshly grilled with authentic African spices • London & Kent Delivery
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default OrderReceipt;

// -------------------------------------------------------------
// Styles
// -------------------------------------------------------------
const main = {
  backgroundColor: '#FFF9F6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '24px 0',
};

const container = {
  maxWidth: '580px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  overflow: 'hidden',
  border: '2px solid #1A0500',
  boxShadow: '6px 6px 0px #1A0500',
};

const headerSection = {
  backgroundColor: '#ED2C02',
  padding: '28px 24px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#FFFFFF',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '1px',
  margin: '0 0 4px 0',
};

const headerSubtitle = {
  color: '#FFE6E0',
  fontSize: '13px',
  margin: '0',
  letterSpacing: '0.5px',
};

const contentSection = {
  padding: '28px 28px 20px 28px',
};

const orderGreeting = {
  color: '#1A0500',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const orderIntro = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 20px 0',
};

const metaBox = {
  backgroundColor: '#FFE6E0',
  border: '1.5px solid #1A0500',
  borderRadius: '16px',
  padding: '16px 20px',
  marginBottom: '24px',
};

const metaLabel = {
  color: '#882200',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.8px',
  margin: '0 0 2px 0',
  textTransform: 'uppercase' as const,
};

const metaValue = {
  color: '#1A0500',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const itemsSection = {
  marginBottom: '20px',
};

const sectionTitle = {
  color: '#1A0500',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const divider = {
  borderTop: '1.5px solid #1A0500',
  margin: '8px 0 16px 0',
};

const itemRow = {
  marginBottom: '12px',
};

const itemName = {
  color: '#1A0500',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 2px 0',
};

const itemQty = {
  color: '#ED2C02',
  fontSize: '13px',
  fontWeight: '800',
};

const itemOptions = {
  color: '#777777',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
};

const itemPrice = {
  color: '#1A0500',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
};

const itemDivider = {
  borderTop: '1px dashed #E5D5D0',
  margin: '10px 0',
};

const summarySection = {
  marginTop: '12px',
};

const summaryRow = {
  marginBottom: '6px',
};

const summaryLabel = {
  color: '#666666',
  fontSize: '13px',
  margin: '0',
};

const summaryValue = {
  color: '#1A0500',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
};

const grandTotalLabel = {
  color: '#1A0500',
  fontSize: '16px',
  fontWeight: '800',
  margin: '0',
};

const grandTotalValue = {
  color: '#ED2C02',
  fontSize: '18px',
  fontWeight: '800',
  margin: '0',
};

const helpBox = {
  backgroundColor: '#FFF5F2',
  borderRadius: '12px',
  padding: '12px 16px',
  marginTop: '16px',
  border: '1px solid #FFD0C5',
};

const helpText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
};

const helpLink = {
  color: '#ED2C02',
  fontWeight: 'bold',
  textDecoration: 'underline',
};

const footerSection = {
  backgroundColor: '#1A0500',
  padding: '18px 24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const footerSubtext = {
  color: '#FFB2A1',
  fontSize: '11px',
  margin: '0',
};
