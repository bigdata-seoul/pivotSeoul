import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * 이 파일은 모바일 앱의 시작점(App.tsx)입니다.
 * 비전공자를 위한 설명:
 * 이 앱은 실제 화면을 직접 다 그리는 것이 아니라, 이미 만들어진 웹사이트(프런트엔드)를
 * 모바일 화면에 '웹 뷰(WebView)'라는 일종의 브라우저 창을 통해 보여주는 역할을 합니다.
 */
export default function App() {
  // 앱이 처음 실행될 때 접속할 기본 주소를 결정합니다.
  const defaultUrl = useMemo(() => {
    // 안드로이드 시뮬레이터는 컴퓨터의 로컬 환경에 접속할 때 10.0.2.2라는 특수한 주소를 사용합니다.
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }
    // 아이폰이나 다른 환경은 보통 localhost를 사용합니다.
    return 'http://localhost:3000';
  }, []);

  // url: 현재 웹 뷰가 보여주고 있는 주소
  const [url, setUrl] = useState(defaultUrl);
  // inputUrl: 사용자가 주소창에 입력하고 있는 주소
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  // loading: 웹 페이지를 불러오는 중인지 여부
  const [loading, setLoading] = useState(true);

  // '열기' 버튼을 눌렀을 때 실행되는 함수입니다.
  const applyUrl = () => {
    const trimmed = inputUrl.trim(); // 앞뒤 공백 제거
    if (!trimmed) return;
    setUrl(trimmed); // 입력한 주소로 웹 뷰를 갱신합니다.
  };

  return (
    // SafeAreaView: 아이폰의 노치 디자인이나 하단 바에 화면이 가려지지 않게 보호해주는 영역
    <SafeAreaView style={styles.container}>
      {/* 상단 주소 입력창 영역 */}
      <View style={styles.topBar}>
        <View style={styles.inputWrap}>
          <TextInput
            value={inputUrl}
            onChangeText={setInputUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
            placeholder="접속 주소를 입력하세요 (예: http://localhost:3000)"
          />
        </View>
        <Pressable style={styles.button} onPress={applyUrl}>
          <Text style={styles.buttonText}>열기</Text>
        </Pressable>
      </View>

      {/* 도움말 텍스트 */}
      <View style={styles.helper}>
        <Text style={styles.helperText}>프런트엔드 개발 서버 주소를 입력해 화면을 확인합니다.</Text>
      </View>

      {/* 웹 뷰 영역: 실제 웹사이트가 나타나는 곳 */}
      <View style={styles.webviewWrap}>
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}  // 로딩 시작 시 상태 변경
          onLoadEnd={() => setLoading(false)}   // 로딩 완료 시 상태 변경
          javaScriptEnabled={true}               // 자바스크립트 실행 허용
          domStorageEnabled={true}               // 웹 저장소 사용 허용
          startInLoadingState={true}
          // 로딩 중에 보여줄 화면 (빙글빙글 돌아가는 아이콘)
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loaderText}>웹 앱을 불러오는 중입니다...</Text>
            </View>
          )}
        />
      </View>

      {/* 오른쪽 상단 '연결 중' 표시 */}
      {loading && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>연결 중</Text>
        </View>
      )}

      {/* 상태 표시줄 (배터리, 시계 등) */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// 화면의 디자인(스타일)을 정의하는 부분입니다. (CSS와 유사)
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

