import { Image, StyleSheet, TextInput, View, StatusBar, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/auth';

export default function UserProfileScreen() {
  const { user } = useAuth()

  return (
    <>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={user.profileImage} style={styles.profileImage} />
          <ThemedText type="subtitle" style={styles.quote}>
            {user.quote}
          </ThemedText>
        </View>

        <View style={styles.infoSection}>
          <ThemedText style={styles.infoLabel}>Nome:</ThemedText>
          <ThemedText style={styles.infoValue}>{user.name}</ThemedText>

          <ThemedText style={styles.infoLabel}>Matrícula:</ThemedText>
          <ThemedText style={styles.infoValue}>{user.registration}</ThemedText>

          <ThemedText style={styles.infoLabel}>Horas Acumuladas:</ThemedText>
          <ThemedText style={styles.infoValue}>{user.accumulatedHours}h</ThemedText>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    backgroundColor: '#ffffff',
    flexGrow: 3, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
  },
  infoSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    height: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
