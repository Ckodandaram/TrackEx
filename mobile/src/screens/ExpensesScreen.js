import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Title, Paragraph, ActivityIndicator, IconButton } from 'react-native-paper';
import { expenseService } from '../services/dataService';

const ExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.delete(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const renderExpense = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Title>₹{item.amount}</Title>
            <Paragraph>{item.category} - {item.paymentMode}</Paragraph>
            <Paragraph style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Paragraph>
            {item.notes && <Paragraph style={styles.notes}>{item.notes}</Paragraph>}
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item._id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card style={styles.card}>
            <Card.Content>
              <Paragraph>No expenses found</Paragraph>
            </Card.Content>
          </Card>
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense', { onSave: fetchExpenses })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ExpensesScreen;
