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
  options?: unknown;
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

/**
 * Extracts and formats all nested options (Spice level, sides, extras) regardless of payload format
 */
export function extractItemOptions(options: unknown): { label: string; values: string }[] {
  if (!options) return [];

  let parsed = options;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [{ label: 'Option', values: String(parsed) }];
    }
  }

  const result: { label: string; values: string }[] = [];

  if (Array.isArray(parsed)) {
    const list = parsed
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'name' in item) {
          const price = Number((item as { price?: number }).price || 0);
          return `${(item as { name: string }).name}${price > 0 ? ` (+£${price.toFixed(2)})` : ''}`;
        }
        return String(item);
      })
      .filter(Boolean);

    if (list.length > 0) {
      result.push({ label: 'Selected Options', values: list.join(', ') });
    }
    return result;
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;

    // Handle standard keys
    if (obj.spice_level && typeof obj.spice_level === 'string') {
      result.push({ label: 'Spice Level', values: obj.spice_level });
    }

    if (Array.isArray(obj.sides) && obj.sides.length > 0) {
      result.push({ label: 'Sides', values: obj.sides.join(', ') });
    }

    if (obj.special_notes && typeof obj.special_notes === 'string') {
      result.push({ label: 'Special Notes', values: obj.special_notes });
    }

    // Handle generic dictionary keys (e.g. "Spice Level", "Add an Extra Side", "Sides")
    Object.entries(obj).forEach(([key, val]) => {
      if (['spice_level', 'sides', 'special_notes'].includes(key)) return;

      if (Array.isArray(val) && val.length > 0) {
        const names = val
          .map((v) => {
            if (typeof v === 'string') return v;
            if (v && typeof v === 'object' && 'name' in v) {
              const price = Number((v as { price?: number }).price || 0);
              return `${(v as { name: string }).name}${price > 0 ? ` (+£${price.toFixed(2)})` : ''}`;
            }
            return String(v);
          })
          .filter(Boolean);

        if (names.length > 0) {
          result.push({ label: key, values: names.join(', ') });
        }
      } else if (typeof val === 'string' && val.trim()) {
        result.push({ label: key, values: val });
      }
    });
  }

  return result;
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
                Items Ordered ({order_items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} items)
              </Heading>
              <Hr style={divider} />

              {order_items.length === 0 ? (
                <Text style={{ color: '#666', fontSize: '13px', fontStyle: 'italic' }}>
                  Items are being processed with your order summary.
                </Text>
              ) : (
                order_items.map((item, index) => {
                  const optionsList = extractItemOptions(item.options);

                  return (
                    <div key={index} style={itemCard}>
                      <Row>
                        <Column style={{ width: '75%' }}>
                          <Text style={itemName}>
                            {item.quantity}× {item.product_name}
                          </Text>

                          {/* Selected Side Options & Spice Level */}
                          {optionsList.length > 0 && (
                            <div style={optionsContainer}>
                              {optionsList.map((opt, oIdx) => (
                                <Text key={oIdx} style={optionRowText}>
                                  <strong style={{ color: '#ED2C02' }}>{opt.label}:</strong> {opt.values}
                                </Text>
                              ))}
                            </div>
                          )}
                        </Column>
                        <Column style={{ width: '25%', textAlign: 'right', verticalAlign: 'top' }}>
                          <Text style={itemPrice}>£{Number(item.total).toFixed(2)}</Text>
                          <Text style={unitPriceText}>
                            (£{Number(item.unit_price).toFixed(2)} each)
                          </Text>
                        </Column>
                      </Row>
                    </div>
                  );
                })
              )}

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
                <Link href="mailto:order@tyliciousgrillz.com" style={helpLink}>
                  order@tyliciousgrillz.com
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
  padding: '32px 24px',
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
};

const contentSection = {
  padding: '28px 24px',
};

const orderGreeting = {
  color: '#1A0500',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 6px 0',
};

const orderIntro = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 20px 0',
};

const metaBox = {
  backgroundColor: '#FFF5F2',
  borderRadius: '16px',
  padding: '16px 20px',
  border: '1.5px solid #FFD0C5',
  marginBottom: '24px',
};

const metaLabel = {
  color: '#888888',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.8px',
  margin: '0 0 2px 0',
};

const metaValue = {
  color: '#1A0500',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
};

const itemsSection = {
  marginBottom: '24px',
};

const sectionTitle = {
  color: '#1A0500',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const divider = {
  borderTop: '1.5px solid #EFEFEF',
  margin: '12px 0',
};

const itemCard = {
  backgroundColor: '#FAFAFA',
  border: '1px solid #EAEAEA',
  borderRadius: '12px',
  padding: '12px 14px',
  marginBottom: '10px',
};

const itemName = {
  color: '#1A0500',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 4px 0',
};

const optionsContainer = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '6px 10px',
  border: '1px solid #F0E0DB',
  marginTop: '4px',
};

const optionRowText = {
  color: '#444444',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '2px 0',
};

const itemPrice = {
  color: '#1A0500',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 2px 0',
};

const unitPriceText = {
  color: '#888888',
  fontSize: '11px',
  margin: '0',
};

const summarySection = {
  backgroundColor: '#FFF9F6',
  borderRadius: '16px',
  padding: '16px 20px',
  border: '1.5px solid #FFD0C5',
  marginTop: '16px',
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
  backgroundColor: '#F8F9FA',
  borderRadius: '12px',
  padding: '14px 16px',
  textAlign: 'center' as const,
};

const helpText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};

const helpLink = {
  color: '#ED2C02',
  fontWeight: '600',
  textDecoration: 'underline',
};

const footerSection = {
  backgroundColor: '#1A0500',
  padding: '20px 24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const footerSubtext = {
  color: '#999999',
  fontSize: '11px',
  margin: '0',
};
