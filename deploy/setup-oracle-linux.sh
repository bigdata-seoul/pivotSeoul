#!/usr/bin/env bash
# Oracle Linux 8/9 에 Docker + Docker Compose 설치 후 pivotSeoul 스택을 기동합니다.
# 사용법: bash deploy/setup-oracle-linux.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "======================================================"
echo "  pivotSeoul — Oracle Linux 배포 스크립트"
echo "======================================================"

# ── 0. root 권한 확인 ─────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  echo "[ERROR] root 또는 sudo 로 실행해야 합니다."
  exit 1
fi

# ── 1. Oracle Linux 버전 감지 ─────────────────────────────
OL_VERSION=$(rpm -E '%{rhel}' 2>/dev/null || echo "8")
echo "[INFO] Oracle Linux ${OL_VERSION} 감지"

# ── 2. 기존 Docker 제거 (충돌 방지) ──────────────────────
echo "[INFO] 기존 Docker 패키지 제거 중..."
dnf remove -y docker docker-client docker-client-latest \
  docker-common docker-latest docker-latest-logrotate \
  docker-logrotate docker-engine podman runc 2>/dev/null || true

# ── 3. Docker CE 레포지토리 추가 ──────────────────────────
echo "[INFO] Docker CE 레포지토리 추가 중..."
dnf install -y dnf-utils
dnf config-manager --add-repo \
  https://download.docker.com/linux/rhel/docker-ce.repo

# ── 4. Docker Engine 설치 ─────────────────────────────────
echo "[INFO] Docker Engine 설치 중..."
dnf install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# ── 5. Docker 서비스 시작 및 부팅 자동 시작 ───────────────
echo "[INFO] Docker 서비스 시작..."
systemctl enable --now docker

# ── 6. 방화벽 포트 허용 (firewalld 사용 중인 경우) ────────
if systemctl is-active --quiet firewalld; then
  echo "[INFO] 방화벽 포트 3000, 8080 허용..."
  firewall-cmd --permanent --add-port=3000/tcp
  firewall-cmd --permanent --add-port=8080/tcp
  firewall-cmd --reload
fi

# ── 7. .env 파일 확인 ─────────────────────────────────────
echo ""
if [[ ! -f "${APP_DIR}/.env" ]]; then
  echo "[WARN] .env 파일이 없습니다. .env.example 을 복사합니다."
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
  echo "[ACTION] ${APP_DIR}/.env 을 열어 POSTGRES_PASSWORD 등을 반드시 수정하세요!"
  echo ""
  read -rp "  .env 수정을 완료했으면 Enter 를 눌러 계속하세요..." _
fi

# ── 8. 이미지 빌드 & 스택 기동 ────────────────────────────
echo "[INFO] Docker 이미지 빌드 및 컨테이너 기동 중..."
cd "${APP_DIR}"
docker compose build --parallel
docker compose up -d

# ── 9. 상태 확인 ──────────────────────────────────────────
echo ""
echo "[INFO] 컨테이너 상태:"
docker compose ps

echo ""
echo "======================================================"
echo "  배포 완료!"
echo "  Frontend : http://$(hostname -I | awk '{print $1}'):3000"
echo "  Backend  : http://$(hostname -I | awk '{print $1}'):8080"
echo "======================================================"
