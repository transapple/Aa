import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Drives a slow drifting motion of the gradient layer to mimic
  // a moving/animated gradient background.
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.15, width * 0.15],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.05, height * 0.05],
  });

  const handleLogin = () => {
    // No real auth wired up yet — this just moves us into the app.
    navigation.replace('Dashboard');
  };

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX }, { translateY }, { scale: 1.3 }] },
        ]}
      >
        <LinearGradient
          colors={['#16274A', '#1E3563', '#3E8EDE', '#16274A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centerWrap}
      >
        <View style={styles.card}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>A</Text>
            </View>
            <View>
              <Text style={styles.brandName}>AiO School Manager</Text>
              <Text style={styles.brandSub}>Sign in to continue</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@school.com"
              placeholderTextColor="#9AA3B5"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.pwdWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 44 }]}
                placeholder="••••••••"
                placeholderTextColor="#9AA3B5"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.pwdToggle}
                onPress={() => setShowPassword((s) => !s)}
              >
                <Text style={{ fontSize: 13 }}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.footerLink}>Sign up</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#16274A' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 26 },
  brandBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2E9E7C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  brandName: { fontSize: 18, fontWeight: '800', color: '#16274A' },
  brandSub: { fontSize: 12, color: '#5B647A', marginTop: 2 },
  field: { marginBottom: 16 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14.5,
    backgroundColor: '#FAFBFD',
    color: '#1D2433',
  },
  pwdWrap: { position: 'relative', justifyContent: 'center' },
  pwdToggle: { position: 'absolute', right: 10 },
  forgotRow: { alignItems: 'flex-end', marginBottom: 18 },
  forgotText: { fontSize: 12.5, color: '#3E8EDE', fontWeight: '600' },
  loginButton: {
    backgroundColor: '#16274A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { marginTop: 18, alignItems: 'center' },
  footerText: { fontSize: 12.5, color: '#5B647A' },
  footerLink: { color: '#2E9E7C', fontWeight: '700' },
});
