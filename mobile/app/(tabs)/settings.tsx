import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/auth';

export default function UserProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20 }
      ]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-circle" size={120} color="#666666" />
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            <ThemedText style={styles.logoutText}>Sair</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Rest of the existing code remains the same */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoLabel}>Nome:</ThemedText>
          <ThemedText style={styles.infoValue}>{user!.name}</ThemedText>

          <ThemedText style={styles.infoLabel}>Matrícula:</ThemedText>
          <ThemedText style={styles.infoValue}>{user!.registration}</ThemedText>

          <ThemedText style={styles.infoLabel}>Horas acumuladas esse mês:</ThemedText>
          <ThemedText style={styles.infoValue}>{user!.totalHours.toFixed(1)} h</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Seus cursos</ThemedText>
          {user?.UserOnCourses?.map(({ course }) => (
            <View key={course.id} style={styles.card}>
              <ThemedText style={styles.cardTitle}>{course.name}</ThemedText>
              <ThemedText style={styles.cardSubtitle}>{course.university.name}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Projetos</ThemedText>
          {user?.UsersOnProjects?.map(({ project }) => (
            <View key={project.id} style={styles.card}>
              <ThemedText style={styles.cardTitle}>{project.name}</ThemedText>
              <ThemedText style={styles.cardSubtitle}>{project.description}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: "auto",
  },
  logoutText: {
    color: '#FF4444',
    marginLeft: 4,
    fontSize: 16,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});
