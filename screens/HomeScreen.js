import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, spacing, shadow } from '../theme/theme';

const CLASS_DATA = [
  { label: 'P1', value: 95, gradient: ['#2D9CDB', '#1478E6'] },
  { label: 'P2', value: 88, gradient: ['#4BCB96', '#19B981'] },
  { label: 'P3', value: 82, gradient: ['#F8B400', '#FF9D00'] },
  { label: 'P4', value: 78, gradient: ['#8D42F4', '#7220D8'] },
  { label: 'P5', value: 90, gradient: ['#25D5D2', '#18C1BE'] },
  { label: 'P6', value: 86, gradient: ['#F05B8A', '#E94A7C'] },
];

const ACTIVITIES = [
  { day: '28', month: 'Aug', title: 'New student enrolled', detail: 'Aisha Nakanwagi has been enrolled in P3.', time: '2 hours ago', icon: 'person-add-outline', tint: '#D9F8EA', color: '#16A36F' },
  { day: '30', month: 'Aug', title: 'Exam result updated', detail: 'Mathematics - P6 (Term 1) results are now available.', time: '4 hours ago', icon: 'document-text-outline', tint: '#EEE3FF', color: '#8B5CF6' },
  { day: '02', month: 'Sep', title: 'New message', detail: 'From: Parent (James Wabwire) - Re: School Fees', time: '5 hours ago', icon: 'chatbubble-ellipses-outline', tint: '#DDF2FF', color: '#2F8EDB' },
  { day: '05', month: 'Sep', title: 'Fee payment received', detail: 'UGX 200,000 from Sarah Nakato (P4)', time: '6 hours ago', icon: 'cash-outline', tint: '#FFE2EC', color: '#E84D7D' },
];

const UPCOMING = [
  { day: '28', month: 'Aug', title: 'Parent-Teacher Meeting', place: 'Main Hall', time: '09:00 AM - 12:00 PM', tint: '#DDF2FF', icon: 'people-outline' },
  { day: '30', month: 'Aug', title: 'Science Fair', place: 'School Grounds', time: '08:00 AM - 04:00 PM', tint: '#EEE3FF', icon: 'flask-outline' },
  { day: '02', month: 'Sep', title: 'Mid-Term Exams', place: 'All Classes', time: '08:00 AM - 12:00 PM', tint: '#D9F8EA', icon: 'document-text-outline' },
  { day: '05', month: 'Sep', title: 'Sports Day', place: 'School Field', time: '08:00 AM - 01:00 PM', tint: '#FFE2EC', icon: 'football-outline' },
];

const STAT_CARDS = [
  { label: 'Total Students', value: '248', icon: 'people', gradient: ['#DDF2FF', '#E8F8FF'], iconColor: '#1976D2', on: 'Students' },
  { label: 'Total Teachers', value: '18', icon: 'person', gradient: ['#F1E7FF', '#F7F0FF'], iconColor: '#7435D1', on: 'Teachers' },
  { label: 'Total Classes', value: '12', icon: 'school', gradient: ['#DDF8EF', '#E9FFF7'], iconColor: '#0C9A72', on: 'Students' },
  { label: 'Total Subjects', value: '22', icon: 'book', gradient: ['#FFF2D8', '#FFF8EA'], iconColor: '#C57A08', on: 'AcademicSetup' },
];

export default function HomeScreen({ navigation }) {
  const now = useMemo(() => new Date(), []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  const navigate = (screen) => {
    if (!screen) return;
    if (['Teachers', 'AcademicSetup'].includes(screen)) navigation.navigate('More', { screen });
    else navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0877EA', '#0B67D6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.brandWrap}>
              <View style={styles.logoBox}>
                <Ionicons name="school" size={34} color="#fff" />
                <View style={styles.logoAccent}><Ionicons name="book" size={11} color="#0B67D6" /></View>
              </View>
              <Text style={styles.brandText}>School Management{`\n`}System</Text>
            </View>
            <View style={styles.profileActions}>
              <View style={styles.notificationWrap}>
                <Ionicons name="notifications" size={23} color="#fff" />
                <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
              </View>
              <View style={styles.avatar}><Ionicons name="person" size={22} color="#0A66D6" /></View>
            </View>
          </View>

          <View style={styles.timeCard}>
            <InfoCell label="Time" value={time} />
            <View style={styles.infoDivider} />
            <InfoCell label="Date" value={date} />
            <View style={styles.infoDivider} />
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Term</Text>
              <Text style={styles.infoValue}>Term 1</Text>
              <Text style={styles.infoSub}>2025/2026</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.statsGrid}>
            {STAT_CARDS.map((card) => (
              <Pressable key={card.label} onPress={() => navigate(card.on)} style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}>
                <LinearGradient colors={card.gradient} style={styles.statBackground}>
                  <View style={styles.statCopy}>
                    <Text style={styles.statLabel}>{card.label}</Text>
                    <Text style={styles.statValue}>{card.value}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={23} color="#124A91" style={styles.chevron} />
                  <View style={[styles.statWatermark, { backgroundColor: `${card.iconColor}14` }]}>
                    <Ionicons name={card.icon} size={74} color={card.iconColor} />
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          <SectionHeader title="Class Overview" onPress={() => navigate('Students')} />
          <View style={[styles.panel, shadow.soft]}>
            <View style={styles.chartArea}>
              <View style={styles.yAxis}>
                {['100%', '75%', '50%', '25%', '0%'].map((tick) => <Text key={tick} style={styles.axisText}>{tick}</Text>)}
              </View>
              <View style={styles.chartBody}>
                {[0, 25, 50, 75, 100].map((line) => <View key={line} style={[styles.gridLine, { bottom: `${line}%` }]} />)}
                <View style={styles.bars}>
                  {CLASS_DATA.map((item) => (
                    <View key={item.label} style={styles.barColumn}>
                      <Text style={styles.barValue}>{item.value}%</Text>
                      <LinearGradient colors={item.gradient} style={[styles.bar, { height: `${item.value}%` }]} />
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <SectionHeader title="Recent Activities" onPress={() => {}} />
          <View style={[styles.panel, shadow.soft, styles.listPanel]}>
            {ACTIVITIES.map((item, index) => (
              <Pressable key={item.title} style={({ pressed }) => [styles.activityRow, pressed && styles.pressed]}>
                <View style={[styles.dateBadge, { backgroundColor: item.tint }]}>
                  <Text style={[styles.dateDay, { color: item.color }]}>{item.day}</Text>
                  <Text style={[styles.dateMonth, { color: item.color }]}>{item.month}</Text>
                </View>
                <View style={styles.activityIcon}><Ionicons name={item.icon} size={17} color={item.color} /></View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.activityDetail} numberOfLines={1}>{item.detail}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityTime}>{item.time}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#1B4C91" />
                </View>
                {index < ACTIVITIES.length - 1 ? <View style={styles.rowDivider} /> : null}
              </Pressable>
            ))}
          </View>

          <SectionHeader title="Upcoming" onPress={() => {}} />
          <View style={[styles.panel, shadow.soft, styles.listPanel, { marginBottom: 24 }]}>
            {UPCOMING.map((item, index) => (
              <Pressable key={item.title} style={({ pressed }) => [styles.upcomingRow, pressed && styles.pressed]}>
                <View style={[styles.dateBadge, { backgroundColor: item.tint }]}>
                  <Text style={styles.upcomingDay}>{item.day}</Text>
                  <Text style={styles.upcomingMonth}>{item.month}</Text>
                </View>
                <View style={styles.upcomingCopy}>
                  <Text style={styles.upcomingTitle}>{item.title}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color="#7890AA" />
                    <Text style={styles.metaText}>{item.place}</Text>
                    <Ionicons name="time-outline" size={14} color="#7890AA" style={{ marginLeft: 10 }} />
                    <Text style={styles.metaText}>{item.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#1B4C91" />
                {index < UPCOMING.length - 1 ? <View style={styles.rowDivider} /> : null}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCell({ label, value }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress} hitSlop={8} style={styles.viewAll}>
        <Text style={styles.viewAllText}>View All</Text>
        <Ionicons name="chevron-forward" size={17} color="#1472D9" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F8FC' },
  content: { paddingBottom: 16 },
  hero: { paddingTop: 10, paddingHorizontal: 18, paddingBottom: 18, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 76 },
  brandWrap: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoAccent: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#F7D54A', right: 6, bottom: 8, alignItems: 'center', justifyContent: 'center' },
  brandText: { color: '#fff', fontSize: 18, lineHeight: 21, fontWeight: '800', marginLeft: 7 },
  profileActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  notificationWrap: { position: 'relative', width: 30, alignItems: 'center' },
  badge: { position: 'absolute', right: -2, top: -7, width: 18, height: 18, borderRadius: 9, backgroundColor: '#FF4B4B', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#0877EA' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  timeCard: { marginTop: 6, backgroundColor: 'rgba(255,255,255,0.90)', borderRadius: 15, minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  infoCell: { flex: 1 },
  infoDivider: { width: 1, height: 48, backgroundColor: '#D6E1EC', marginHorizontal: 11 },
  infoLabel: { color: '#2A4F7D', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { color: '#123D7A', fontSize: 17, fontWeight: '800' },
  infoSub: { color: '#6C88A5', fontSize: 11, marginTop: 2, fontWeight: '600' },
  body: { paddingHorizontal: 13, paddingTop: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48.7%', height: 126, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  statBackground: { flex: 1, padding: 17, position: 'relative', overflow: 'hidden' },
  statCopy: { zIndex: 2 },
  statLabel: { color: '#123F7A', fontSize: 14, fontWeight: '700' },
  statValue: { color: '#0B3E83', fontSize: 31, fontWeight: '800', marginTop: 7 },
  chevron: { position: 'absolute', right: 15, top: 60, zIndex: 4 },
  statWatermark: { position: 'absolute', right: -14, bottom: -22, width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8, paddingHorizontal: 5 },
  sectionTitle: { color: '#0C3977', fontSize: 18, fontWeight: '800' },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#1472D9', fontSize: 13, fontWeight: '700' },
  panel: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E4EDF5', marginBottom: 13, overflow: 'hidden' },
  chartArea: { height: 183, flexDirection: 'row', paddingTop: 13, paddingBottom: 12, paddingLeft: 8, paddingRight: 11 },
  yAxis: { width: 40, justifyContent: 'space-between', paddingBottom: 20 },
  axisText: { color: '#7890AA', fontSize: 11, textAlign: 'right' },
  chartBody: { flex: 1, position: 'relative', marginLeft: 7, marginBottom: 20 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#E7EEF5' },
  bars: { position: 'absolute', left: 8, right: 8, bottom: 0, top: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  barColumn: { height: '100%', width: '13%', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' },
  barValue: { color: '#496D9C', fontSize: 11, fontWeight: '700', position: 'absolute', top: 0 },
  bar: { width: '74%', borderTopLeftRadius: 5, borderTopRightRadius: 5, position: 'absolute', bottom: 0, minHeight: 5 },
  barLabel: { color: '#496D9C', fontSize: 11, fontWeight: '600', position: 'absolute', bottom: -20 },
  listPanel: { paddingHorizontal: 10 },
  activityRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingVertical: 7, position: 'relative' },
  dateBadge: { width: 43, height: 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  dateDay: { fontSize: 16, fontWeight: '800' },
  dateMonth: { fontSize: 10, fontWeight: '700', marginTop: 1 },
  activityIcon: { width: 28, alignItems: 'center', marginRight: 3 },
  activityCopy: { flex: 1, paddingRight: 5 },
  activityTitle: { color: '#164681', fontSize: 13.5, fontWeight: '700' },
  activityDetail: { color: '#5D86B1', fontSize: 11, marginTop: 3 },
  activityRight: { width: 75, alignItems: 'flex-end', justifyContent: 'center' },
  activityTime: { color: '#3973AD', fontSize: 10.5, marginBottom: 4 },
  rowDivider: { position: 'absolute', left: 53, right: 0, bottom: 0, height: 1, backgroundColor: '#E9EFF5' },
  upcomingRow: { minHeight: 63, flexDirection: 'row', alignItems: 'center', paddingVertical: 7, position: 'relative' },
  upcomingDay: { color: '#3973AD', fontSize: 15, fontWeight: '800' },
  upcomingMonth: { color: '#3973AD', fontSize: 10, fontWeight: '700', marginTop: 1 },
  upcomingCopy: { flex: 1, paddingRight: 5 },
  upcomingTitle: { color: '#164681', fontSize: 13.5, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, flexWrap: 'nowrap' },
  metaText: { color: '#7089A5', fontSize: 10.5, marginLeft: 2, flexShrink: 1 },
});
