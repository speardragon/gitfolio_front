# 기본 Node.js 이미지 사용 (slim 버전으로 변경)
FROM node:20.4-slim AS base

# 의존성 설치 단계
FROM base AS builder
WORKDIR /app

# 패키지 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 타입 체크 및 Next.js 빌드
# 사소한 경고로 빌드가 실패하는 것을 막기 윟마
RUN CI=false npm run build

# 프로덕션 이미지 생성
FROM base AS runner
WORKDIR /app

# 환경변수 설정
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 시스템 의존성 설치
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Next.js 필수 파일들만 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 사용자 전환
USER nextjs

# 포트 설정
EXPOSE 3000

# 환경변수 설정
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 서버 실행
CMD ["node", "server.js"]