# 에셋 출처와 최적화

모든 사례·증명서·성과·로고는 첨부 프로젝트가 참조하던 원본을 다운로드해 로컬에 보관했습니다. 새로운 성과나 인증 자료는 제작하지 않았습니다. 원본 이미지의 글자, 블라인드 영역, 수치, 화면 비율을 유지했습니다.

## 직접 제작한 그래픽

- `public/design/patent-folio-3d.webp`: 메인 비주얼에 사용한 투명 퍼플 폴더·IP 토큰 3D 이미지.
- `public/design/marketing-3d.webp`: 전문성 소개에 사용한 유리 재질 확성기·커서 3D 이미지.
- 두 이미지는 built-in image_gen으로 직접 생성했습니다. 1254×1254 RGBA 원본을 투명도를 보존한 WebP로 변환했으며 용량은 각각 216,122 / 213,460 bytes입니다. 실제 인증이나 성과 자료를 대체하지 않는 장식 이미지입니다.
- 원본 PNG는 로컬 작업 자료에 보관하며, 정확한 생성 프롬프트는 `GENERATED-ASSETS-v2.json`에 포함했습니다.
- 이전 버전의 장식 그래픽은 로컬 작업 자료에 보관합니다.
- 읽기 진행률, 순차 강조, 그래픽 부유는 CSS 및 React로 구현했습니다.
- `public/media/patent-video-poster.webp`: 원본 GIF의 첫 프레임. 모션 감소 설정에서만 표시합니다.

## 기존 이미지

| 로컬 파일 | 원본 출처 |
| --- | --- |
| `public/media/medical_moz.png` | https://ik.imagekit.io/suelle/rich/medical_moz.png |
| `public/media/before&after_moz.png` | https://ik.imagekit.io/suelle/rich/before&after_moz.png |
| `public/media/shortform_moz.png` | https://ik.imagekit.io/suelle/rich/shortform_moz.png |
| `public/media/1.jpg` | https://ik.imagekit.io/suelle/rich/1.jpg |
| `public/media/2.jpg` | https://ik.imagekit.io/suelle/rich/2.jpg |
| `public/media/3.jpg` | https://ik.imagekit.io/suelle/rich/3.jpg |
| `public/media/4.jpg` | https://ik.imagekit.io/suelle/rich/4.jpg |
| `public/media/5.jpg` | https://ik.imagekit.io/suelle/rich/5.jpg |
| `public/media/sssssssss.webp` | https://ecimg.cafe24img.com/pg2535b99666738022/bluewelltech/sssssssss.png |
| `public/media/PATENTGIF.gif` | https://ecimg.cafe24img.com/pg2535b99666738022/bluewelltech/PATENTGIF.gif |
| `public/media/patentimage.webp` | https://ecimg.cafe24img.com/pg2535b99666738022/bluewelltech/patentimage.png |
| `public/media/CTR_image_precise_transparent.webp` | https://ecimg.cafe24img.com/pg2535b99666738022/bluewelltech/CTR_image_precise_transparent.png |
| `public/media/lawmun.webp` | https://ik.imagekit.io/suelle/%EB%A1%9C%EB%AC%B8/%EB%A1%9C%EB%AC%B8%EB%B8%94%EB%9E%99.png |

기존 SVG 아이콘은 `public/figma/`에 유지했습니다. 외부 레퍼런스 사이트의 이미지는 페이지에 사용하지 않았습니다.

## WebP 최적화

| 파일 | 원본 bytes | 최적화 bytes | 표시용 크기 |
| --- | ---: | ---: | --- |
| sssssssss.webp | 4,492,594 | 492,060 | 2400 × 1741 |
| CTR_image_precise_transparent.webp | 1,541,730 | 60,566 | 2200 × 772 |
| patentimage.webp | 364,441 | 82,334 | 810 × 1392 |
| lawmun.webp | 87,806 | 12,328 | 800 × 267 |

4개 파일 합계 6,486,571 → 647,288 bytes, 약 90.0% 감소. 원본 PNG는 로컬 작업 자료에 별도 보관했습니다. GIF는 기본 환경에서 원본 애니메이션을 유지합니다.

## 폰트

`public/fonts/PretendardVariable.woff2`와 `public/fonts/OFL.txt`는 원본 프로젝트의 로컬 폰트와 라이선스입니다. 모든 HTML 텍스트와 컨트롤에 동일한 폰트 패밀리를 지정합니다. 이미지 내부의 글자는 교체하지 않습니다.
