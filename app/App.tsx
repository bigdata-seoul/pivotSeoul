import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const defaultUrl = useMemo(() => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }, []);

  const [url, setUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(true);

  const applyUrl = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    setUrl(trimmed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.inputWrap}>
          <TextInput
            value={inputUrl}
            onChangeText={setInputUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
            placeholder="http://localhost:3000"
          />
        </View>
        <Pressable style={styles.button} onPress={applyUrl}>
          <Text style={styles.buttonText}>열기</Text>
        </Pressable>
      </View>

      <View style={styles.helper}>
        <Text style={styles.helperText}>front dev 서버 주소를 입력해 WebView로 실행합니다.</Text>
      </View>

      <View style={styles.webviewWrap}>
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loaderText}>웹 앱 로딩 중...</Text>
            </View>
          )}
        />
      </View>

      {loading && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>연결 중</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  helper: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  helperText: {
    color: '#475569',
    fontSize: 12,
  },
  webviewWrap: {
    flex: 1,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  loaderText: {
    color: '#475569',
    fontSize: 13,
  },
  badge: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});
