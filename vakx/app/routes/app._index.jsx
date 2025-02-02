// Frontend Page of the Shopify App, displayed when the app is installed for a minimal instance
import { Page, Layout, Text, Card, Button, BlockStack } from '@shopify/polaris';

export default function Index() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h1" variant="headingXl" style={{ fontWeight: 'bold', fontSize: '48px' }}>
                Loading VAKX!! 🚀...
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}