# RICH MARKETING

리치마케팅 랜딩페이지 리디자인. React · TypeScript · Vite로 구성된 웹사이트이며, 2026-11-09까지 검토한 문구·디자인·모바일 수정사항을 반영했습니다.

저장소: [bluewelltech/richmarketing-renewal-11NOV](https://github.com/bluewelltech/richmarketing-renewal-11NOV)

## 로컬 실행

Node.js 24 또는 22.12 이상에서 이 폴더를 VS Code로 열고 실행합니다.

```bash
npm ci
npm run dev
```

프로덕션 빌드와 미리보기:

```bash
npm run build
npm run preview -- --port 5307 --strictPort
```

정적 배포 파일은 `dist/`에 생성됩니다. 이미지와 Pretendard 폰트는 `public/`에 포함되어 있으며, `base: './'`로 커스텀 도메인과 GitHub Pages의 저장소 경로를 지원합니다.

## 주요 구성

서비스 개요 → 시장의 문제 → 특허·결과물 → 소비자 인식 → 실제 광고·성과 → 전문성·진행 → 상담·적용 대상 → 가격·신청의 8개 영역입니다.

- 메인 제목: 특허출원기반 / "전략형 IP 마케팅"
- 가격: 1건 40만원, 4건 건당 25만원 / 총 100만원
- 상담 버튼 3개: https://tally.so/r/ZjZ98a
- Meta Pixel: `934398425706152`. 방문 시 `PageView`, 상담 버튼 클릭 시 `Lead`
- 광고 슬라이더 1.6초 / 특허 사례 슬라이더 2.4초. 스와이프·방향키와 모션 감소 설정 지원
- 증명서·활용 사례 수동 뷰어, 진행 단계 등장과 상담 단계 점등
- 모바일 단일 열 구성, 첫 화면 이후 하단 고정 신청 버튼, 최종 신청 영역에서 고정 버튼 숨김
- 로문 로고, 중앙 정렬 CTA, 확대된 핵심 문구, 연보라 패키지와 네온 테두리

`Lead`는 상담 버튼 클릭 기준이며 Tally 제출 완료 이벤트는 아닙니다. 이미지에 포함된 원본 글자는 유지합니다.

## 수정할 파일

| 내용 | 파일 |
| --- | --- |
| 문구·자료 연결 | `src/content.tsx` |
| 영역 배치·모바일 고정 CTA | `src/App.tsx` |
| 스타일·반응형·모션 | `src/layout.css` |
| 가격·상담 URL·이미지 경로 | `src/data.ts` |
| 슬라이드·뷰어·상담 전환 | `src/components/` |
| 메타데이터·픽셀·초기 스크롤 | `index.html` |
| 이미지·폰트 | `public/` |

가격 변경 시 본문의 “25~40만원”도 함께 확인하세요. 각 문구 블록은 `data-copy-source`와 `data-copy-index`로 식별하며, 원본 대조와 승인된 문구 변경 기록은 `review/content-baseline.json`, `review/content-revisions.json`에 있습니다.

## 검사

```bash
npx playwright install chromium
npm test
npm run build
```

Playwright는 5306 포트에서 전용 서버를 실행합니다. PC·모바일 50개 검사는 콘텐츠, 가격, 상담·픽셀, 슬라이더, 수동 뷰어, 스크롤 복원, 반응형을 확인합니다. 테스트에서는 Meta 스크립트를 차단해 실제 광고 전환을 전송하지 않습니다.

5307 포트에서 미리보기를 실행한 상태로 캡처와 텍스트 검사를 생성할 수 있습니다. 모바일 텍스트 검사에는 380px 너비도 포함됩니다.

```bash
node scripts/visual-review.mjs
node scripts/mobile-readability.mjs
node scripts/review-1109.mjs
```

결과는 로컬 `review/` 폴더에 생성되며 Git에서는 제외합니다. 로컬 디자인 백업, 과거 버전, `node_modules/`, `dist/`, `.env`, 테스트 임시 파일도 업로드하지 않습니다.

## GitHub Actions와 Pages

`Check website`는 main 푸시와 PR에서 의존성 설치, 빌드, PC·모바일 검사를 실행합니다.

웹 배포는 별도의 수동 작업입니다.

1. 저장소 Settings → Pages → Source를 GitHub Actions로 설정합니다.
2. Actions → Deploy GitHub Pages → Run workflow를 실행합니다.
3. 배포 완료 후 워크플로에 표시된 주소를 확인합니다.

현재 이 저장소의 GitHub Pages 도메인은 `richmarketing.kr`입니다. main에 소스를 올린 뒤 `Check website` 성공을 확인하고 수동 배포 워크플로를 실행하면 라이브 사이트에 반영됩니다.

## 참고 자료

- [현재 수정사항](review/RELEASE-NOTES.md)
- [이미지 출처·최적화와 폰트](review/ASSETS.md)
- [생성한 3D 이미지 프롬프트](review/GENERATED-ASSETS-v2.json)
