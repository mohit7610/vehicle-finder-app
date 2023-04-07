import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  TextField
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {Frame, Navigation} from '@shopify/polaris';
import {HomeMinor, OrdersMinor, ProductsMinor} from '@shopify/polaris-icons';

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import {useState, useCallback} from 'react';
import { FormCard } from "../components/FormCard";

export default function HomePage() {

  const [email, setEmail] = useState('');

  return (
    <Page>
      <TitleBar title="Vehicle Finder App" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <FormCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
