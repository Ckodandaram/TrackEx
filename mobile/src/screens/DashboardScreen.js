import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { analyticsService } from '../services/dataService';

const DashboardScreen = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.pageTitle}>Dashboard</Title>
      
      {dashboard && (
        <>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Total Expenses</Paragraph>
                <Title style={styles.statValue}>₹{dashboard.totalExpenses.toFixed(2)}</Title>
              </Card.Content>
            </Card>
            
            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>This Month</Paragraph>
                <Title style={styles.statValue}>₹{dashboard.thisMonthTotal.toFixed(2)}</Title>
              </Card.Content>
            </Card>
            
            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Last Month</Paragraph>
                <Title style={styles.statValue}>₹{dashboard.lastMonthTotal.toFixed(2)}</Title>
              </Card.Content>
            </Card>
            
            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Transactions</Paragraph>
                <Title style={styles.statValue}>{dashboard.expenseCount}</Title>
              </Card.Content>
            </Card>
          </View>
          
          {dashboard.insight && (
            <Card style={styles.insightCard}>
              <Card.Content>
                <Title>💡 Insight</Title>
                <Paragraph style={styles.insightText}>{dashboard.insight}</Paragraph>
              </Card.Content>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  insightCard: {
    marginBottom: 16,
  },
  insightText: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default DashboardScreen;
