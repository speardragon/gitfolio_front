# 기본 Node.js 이미지 사용
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

# Next.js 빌드 (경고무시 옵션 추가)
RUN CI=false npm run build

# 프로덕션 이미지 생성
FROM base AS runner
WORKDIR /app

# 환경변수 설정
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 시스템 의존성 설치 및 사용자 생성
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --create-home --home-dir /home/nextjs nextjs

# 빌드 파일 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 사용자 전환
USER nextjs

# 포트 설정
EXPOSE 3000

# 환경변수 설정
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 서버 실행
CMD ["npm", "start"]