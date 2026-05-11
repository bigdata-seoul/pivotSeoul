import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PivotProvider } from './context/PivotContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

/**
 * 이 파일은 프런트엔드(웹 화면)의 가장 뿌리가 되는 곳입니다.
 * 
 * 비전공자를 위한 설명:
 * 사용자가 웹사이트에 접속했을 때 가장 먼저 그려지는 뼈대입니다.
 * 여러 겹의 '상자(Provider)'들이 감싸져 있는데, 각각의 상자는 앱 전체에서 
 * 공통으로 쓰이는 기능들을 담고 있습니다.
 *
 * 감싸는 순서와 의미:
 * 1) ThemeProvider: 화면의 테마(밝은 모드, 어두운 모드, 색상 등)를 관리합니다.
 * 2) PivotProvider: 앱의 핵심 데이터(사용자 정보, 시뮬레이션 결과 등)를 관리합니다.
 * 3) RouterProvider: 주소창의 주소에 따라 어떤 화면을 보여줄지 결정하는 길잡이 역할을 합니다.
 * 4) Toaster: 화면 상단에 알림 메시지(예: "저장되었습니다")를 띄워주는 도구입니다.
 */
export default function App() {
  return (
    <ThemeProvider>
      <PivotProvider>
        <RouterProvider router={router} />
        {/* Toaster는 사용자에게 보여줄 안내 메시지 창입니다. */}
        <Toaster position="top-center" richColors closeButton />
      </PivotProvider>
    </ThemeProvider>
  );
}
