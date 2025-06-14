import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10, fontSize: 14 },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Ini isi PDF saya</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
