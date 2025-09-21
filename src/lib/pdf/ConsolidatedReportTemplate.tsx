import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333333',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#666666',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridItem: {
    width: '50%',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: '4 8',
    fontSize: 10,
    textAlign: 'center',
    marginLeft: 10,
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  profitPositive: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  profitNegative: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  documentPage: {
    width: '100%',
    height: '75%', // Restrict height to fit within page
    objectFit: 'contain',
    marginBottom: 20,
  },
  documentPageContainer: {
    width: '100%',
    height: '75%', // Leave space for header and footer
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Invoice {
  id: string;
  invoice_number: string;
  weight: number;
  profit: number | null;
  sale_cost: number | null;
  purchase_cost: number | null;
  tds: number | null;
  sale_party: { name: string } | null;
  purchase_party: { name: string } | null;
  status: 'payment_pending' | 'completed';
  hsn_code: string | null;
  sale_doc: string | null;
  purchase_doc: string | null;
  toll_doc: string | null;
  weight_report: string | null;
  classification_report: string | null;
  debit_note: string | null;
  credit_note: string | null;
  created_at: string;
  updated_at: string;
}

interface ConsolidatedReportTemplateProps {
  invoice: Invoice;
  documentImages?: Array<{
    type: string;
    data: string; // base64 image data
    name: string;
    originalType: 'image' | 'placeholder';
  }>;
}

const ConsolidatedReportTemplate: React.FC<ConsolidatedReportTemplateProps> = ({ 
  invoice, 
  documentImages = [] 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status: string) => {
    return status === 'completed' 
      ? { ...styles.statusBadge, ...styles.statusCompleted }
      : { ...styles.statusBadge, ...styles.statusPending };
  };

  return (
    <Document>
      {/* First page: Invoice Information */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Consolidated Invoice Report</Text>
        
        <View style={styles.section}>
          <Text style={styles.subHeader}>Invoice Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Number:</Text>
                <Text style={styles.value}>{invoice.invoice_number}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={getStatusStyle(invoice.status)}>
                    {invoice.status === 'payment_pending' ? 'Payment Pending' : 'Completed'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{invoice.weight} kg</Text>
              </View>
            </View>
            {invoice.hsn_code && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>HSN Code:</Text>
                  <Text style={styles.value}>{invoice.hsn_code}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Party Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Sale Party:</Text>
                <Text style={styles.value}>{invoice.sale_party?.name || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Purchase Party:</Text>
                <Text style={styles.value}>{invoice.purchase_party?.name || 'Not specified'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Financial Information</Text>
          <View style={styles.grid}>
            {invoice.sale_cost && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Sale Cost:</Text>
                  <Text style={styles.value}>{formatCurrency(invoice.sale_cost)}</Text>
                </View>
              </View>
            )}
            {invoice.purchase_cost && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Purchase Cost:</Text>
                  <Text style={styles.value}>{formatCurrency(invoice.purchase_cost)}</Text>
                </View>
              </View>
            )}
            {invoice.tds !== null && invoice.tds > 0 && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>TDS:</Text>
                  <Text style={styles.value}>{invoice.tds}%</Text>
                </View>
              </View>
            )}
            {invoice.profit !== null && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Profit:</Text>
                  <Text style={[
                    styles.value,
                    invoice.profit >= 0 ? styles.profitPositive : styles.profitNegative
                  ]}>
                    {formatCurrency(invoice.profit)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {(invoice.debit_note || invoice.credit_note) && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Notes</Text>
            {invoice.debit_note && (
              <View style={styles.row}>
                <Text style={styles.label}>Debit Note:</Text>
                <Text style={styles.value}>{invoice.debit_note}</Text>
              </View>
            )}
            {invoice.credit_note && (
              <View style={styles.row}>
                <Text style={styles.label}>Credit Note:</Text>
                <Text style={styles.value}>{invoice.credit_note}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.subHeader}>Document References</Text>
          <View style={styles.grid}>
            {invoice.sale_doc && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Sale Document:</Text>
                  <Text style={styles.value}>{invoice.sale_doc}</Text>
                </View>
              </View>
            )}
            {invoice.purchase_doc && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Purchase Document:</Text>
                  <Text style={styles.value}>{invoice.purchase_doc}</Text>
                </View>
              </View>
            )}
            {invoice.toll_doc && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Toll Document:</Text>
                  <Text style={styles.value}>{invoice.toll_doc}</Text>
                </View>
              </View>
            )}
            {invoice.weight_report && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Weight Report:</Text>
                  <Text style={styles.value}>{invoice.weight_report}</Text>
                </View>
              </View>
            )}
            {invoice.classification_report && (
              <View style={styles.gridItem}>
                <View style={styles.row}>
                  <Text style={styles.label}>Classification Report:</Text>
                  <Text style={styles.value}>{invoice.classification_report}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Timestamps</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Created:</Text>
                <Text style={styles.value}>{formatDate(invoice.created_at)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Last Updated:</Text>
                <Text style={styles.value}>{formatDate(invoice.updated_at)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated on {formatDate(new Date().toISOString())} | Invoice Management System</Text>
        </View>
      </Page>

      {/* Subsequent pages: Document Images and References */}
      {documentImages.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>Document Summary</Text>
          <View style={styles.section}>
            <Text style={styles.subHeader}>Included Documents</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Total Documents:</Text>
              <Text style={styles.value}>{documentImages.length} items</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Images Included:</Text>
              <Text style={styles.value}>{documentImages.filter(doc => doc.originalType === 'image').length} files</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Reference Only:</Text>
              <Text style={styles.value}>{documentImages.filter(doc => doc.originalType === 'placeholder').length} files</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.value, { fontSize: 10, color: '#868e96', textAlign: 'center' }]}>
              Note: Only image documents are included in full detail. Other document types are shown as references only.
            </Text>
          </View>
        </Page>
      )}
      
      {documentImages.map((doc, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <Text style={styles.subHeader}>
            {doc.type}
            {doc.originalType === 'placeholder' && ' (Reference Only)'}
          </Text>
          <View style={styles.documentPageContainer}>
            <Image 
              style={styles.documentPage}
              src={`data:image/jpeg;base64,${doc.data}`}
              alt={`${doc.type} document`}
            />
          </View>
          <View style={styles.footer}>
            <Text>
              {doc.type} | Page {index + 2} of {documentImages.length + 1}
              {doc.originalType === 'placeholder' && ' | Document not included (non-image)'}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ConsolidatedReportTemplate;
