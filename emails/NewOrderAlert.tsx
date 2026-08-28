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
import { OrderData, OrderItemData, extractItemOptions } from './OrderReceipt';

interface NewOrderAlertProps {
  order: OrderData;
  order_items: OrderItemData[];
}

export const NewOrderAlert: React.FC<NewOrderAlertProps> = ({ order, order_items = [] }) => {
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
      <Preview>{`🚨 ACTION REQUIRED: New Order #${order.id} Received - Tylicious Grillz`}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Action Alert Banner */}
          <Section style={alertHeader}>
            <Text style={alertBadge}>🚨 KITCHEN ACTION REQUIRED</Text>
            <Heading style={alertTitle}>NEW ORDER #{order.id}</Heading>
            <Text style={alertSubtitle}>Payment Confirmed via Stripe</Text>
          </Section>

          {/* Main Card Content */}
          <Section style={contentSection}>
            
            {/* Customer Details Box */}
            <Section style={customerBox}>
              <Heading as="h3" style={boxTitle}>Customer & Delivery Details</Heading>
              <Hr style={innerDivider} />
              
              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>CUSTOMER:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{order.customer_name || 'Guest Customer'}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>PHONE:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>
                    {order.customer_phone ? (
                      <Link href={`tel:${order.customer_phone}`} style={phoneLink}>
                        {order.customer_phone}
                      </Link>
                    ) : (
                      'Not provided'
                    )}
                  </Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>EMAIL:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{order.customer_email || 'N/A'}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>FULFILLMENT:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={{ ...infoValue, color: '#ED2C02', fontWeight: 'bold' }}>
                    {order.fulfillment_method || 'Delivery'}
                  </Text>
                </Column>
              </Row>

              {order.delivery_address && (
                <Row style={infoRow}>
                  <Column style={{ width: '35%' }}>
                    <Text style={infoLabel}>ADDRESS:</Text>
                  </Column>
                  <Column style={{ width: '65%' }}>
                    <Text style={{ ...infoValue, fontWeight: '700' }}>
                      {order.delivery_address}
                    </Text>
                  </Column>
                </Row>
              )}

              <Row style={infoRow}>
                <Column style={{ width: '35%' }}>
                  <Text style={infoLabel}>ORDER TIME:</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={infoValue}>{formattedDate}</Text>
                </Column>
              </Row>
            </Section>

            {/* Kitchen Prep Items */}
            <Section style={kitchenSection}>
              <Heading as="h3" style={boxTitle}>
                Items to Prepare ({order_items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} items)
              </Heading>
              <Hr style={innerDivider} />

              {order_items.length === 0 ? (
                <Text style={{ color: '#666', fontSize: '13px', fontStyle: 'italic' }}>
                  No items listed in payload.
                </Text>
              ) : (
                order_items.map((item, index) => {
                  const optionsList = extractItemOptions(item.options);
                  const displayName = item.product_name || item.name || item.item_name || item.title || 'Flame-Grilled Item';
                  const quantity = Math.max(1, Number(item.quantity) || 1);

                  return (
                    <div key={index} style={kitchenItemBox}>
                      <Row>
                        <Column style={{ width: '15%', verticalAlign: 'top' }}>
                          <Text style={kitchenQtyBadge}>{quantity}×</Text>
                        </Column>
                        <Column style={{ width: '85%', verticalAlign: 'top' }}>
                          <Text style={kitchenItemTitle}>{displayName}</Text>
                          
                          {/* Item Customizations and Side Choices */}
                          {optionsList.length > 0 && (
                            <div style={kitchenOptionsBox}>
                              {optionsList.map((opt, oIdx) => (
                                <Text key={oIdx} style={kitchenOptionText}>
                                  <strong style={{ color: '#ED2C02' }}>{opt.label}:</strong> {opt.values}
                                </Text>
                              ))}
                            </div>
                          )}
                        </Column>
                      </Row>
                    </div>
                  );
                })
              )}
            </Section>

            {/* Revenue Summary */}
            <Section style={revenueBox}>
              <Row>
                <Column style={{ width: '50%' }}>
                  <Text style={revenueLabel}>Subtotal: £{Number(order.subtotal).toFixed(2)}</Text>
                  <Text style={revenueLabel}>Delivery Fee: £{Number(order.delivery_fee).toFixed(2)}</Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <Text style={revenueTotalLabel}>TOTAL PAID</Text>
                  <Text style={revenueTotalValue}>£{Number(order.total).toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Tylicious Grillz Automated Kitchen Dispatch System
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default NewOrderAlert;

// -------------------------------------------------------------
// Styles
// -------------------------------------------------------------
const main = {
  backgroundColor: '#F4F4F5',
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

const alertHeader = {
  backgroundColor: '#1A0500',
  padding: '26px 24px',
  textAlign: 'center' as const,
};

const alertBadge = {
  display: 'inline-block',
  backgroundColor: '#ED2C02',
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '1px',
  padding: '4px 12px',
  borderRadius: '100px',
  margin: '0 0 8px 0',
};

const alertTitle = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '900',
  letterSpacing: '0.5px',
  margin: '0 0 2px 0',
};

const alertSubtitle = {
  color: '#00E676',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
};

const contentSection = {
  padding: '24px 28px',
};

const customerBox = {
  backgroundColor: '#F8F9FA',
  border: '1.5px solid #E2E8F0',
  borderRadius: '16px',
  padding: '16px 20px',
  marginBottom: '20px',
};

const boxTitle = {
  color: '#1A0500',
  fontSize: '15px',
  fontWeight: '800',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 6px 0',
};

const innerDivider = {
  borderTop: '1.5px solid #CBD5E1',
  margin: '6px 0 12px 0',
};

const infoRow = {
  marginBottom: '6px',
};

const infoLabel = {
  color: '#64748B',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0',
};

const infoValue = {
  color: '#0F172A',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
};

const phoneLink = {
  color: '#ED2C02',
  fontWeight: 'bold',
  textDecoration: 'underline',
};

const kitchenSection = {
  marginBottom: '20px',
};

const kitchenItemBox = {
  backgroundColor: '#FFF5F2',
  border: '1.5px solid #ED2C02',
  borderRadius: '12px',
  padding: '12px 14px',
  marginBottom: '10px',
};

const kitchenQtyBadge = {
  backgroundColor: '#ED2C02',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '900',
  textAlign: 'center' as const,
  borderRadius: '8px',
  padding: '6px 0',
  margin: '0',
};

const kitchenItemTitle = {
  color: '#1A0500',
  fontSize: '15px',
  fontWeight: '800',
  margin: '0 0 4px 0',
};

const kitchenOptionsBox = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '8px 12px',
  border: '1px solid #FFD0C5',
  marginTop: '6px',
};

const kitchenOptionText = {
  color: '#333333',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '3px 0',
};

const revenueBox = {
  backgroundColor: '#F1F5F9',
  border: '1.5px solid #CBD5E1',
  borderRadius: '16px',
  padding: '16px 20px',
};

const revenueLabel = {
  color: '#475569',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const revenueTotalLabel = {
  color: '#64748B',
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '1px',
  margin: '0',
};

const revenueTotalValue = {
  color: '#00875A',
  fontSize: '20px',
  fontWeight: '900',
  margin: '0',
};

const footerSection = {
  backgroundColor: '#0F172A',
  padding: '14px 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#94A3B8',
  fontSize: '11px',
  margin: '0',
};
