# 프로젝트명 - 깃트폴리오

![제목 없음](https://github.com/user-attachments/assets/9a63d605-d040-4071-9c31-a1af180ea05b)

## 목차

## 팀원 소개

|     <img src ="https://github.com/user-attachments/assets/145cb46c-9962-4e72-bbbc-c2f7dfd21c03" width="150px">      | <img src = "https://github.com/user-attachments/assets/ac47805a-e3c2-447b-8b43-6f9c2f080328" width = "150px"> | <img src="https://github.com/user-attachments/assets/34fa1dd4-0e14-4896-9da2-6079a5f6ed3c" width="150px"> |
| :-----------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
|                                    [ray(강창룡)](https://github.com/speardragon)                                    |                                [nick(김남기)](https://github.com/namkikim0718)                                |                              [bandi(김윤섭)](https://github.com/yoonseopkim)                              |
|                                                      Front-end                                                      |                                                   Back-end                                                    |                                                   Cloud                                                   |
| 이력서 pdf 저장 기능 <br> 이력서 수정 시 UI 개선 <br />반응형 웹 <br />CSRF, XSS에 대응 가능한 토큰 상태 관리<br /> |    API 개발 <br>Kafka, Redis를 통한 성능 개선 <br/>60개 단위 테스트 작성<br/> 클린 아키텍처 기반 리팩토링     |            Jenkins CI/CD 파이프라인 구축 <br>Docker image 최적화 <br/> 환경변수 관리 체계 구축            |

|    <img src ="https://github.com/user-attachments/assets/e2524dda-c594-445c-893b-66c0d11dded8" width="150px">     | <img src = "https://github.com/user-attachments/assets/5700b7f4-1fdc-4528-bc2d-3676ec6f84d4" width = "150px"> | <img src="https://github.com/user-attachments/assets/a14bea00-30f3-45f4-9079-a17177dd7e25" width="150px"> |
| :---------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
|                                    [aida(김건호)](https://github.com/ghk01214)                                    |                                 [ilmin(조일민)](https://github.com/IlMinCho)                                  |                              [eunma(오준택)](https://github.com/Oh-JunTaek)                               |
|                                                       Cloud                                                       |                                                      AI                                                       |                                                    AI                                                     |
| 쿠버네티스 클러스터링 <br>Terraform, Ansible을 통한 인프라 관리 자동화<br/> SSM을 ㅌ오한 더 안전하 서버 접속 설정 |                     멀티프로세싱 적용 <br/>이력서 생성 데이터 처리 파이프 라인 구축 <br/>                     |                           AI 이력서 수정 정형화 로직 <br>LLM Prompt Engineering                           |

## Gitfolio 배포 사이트

[깃트폴리오(현재 내려간 상태)](https://www.gitfolio.site)

## 깃트폴리오 시연 영상

🖥️ [깃트폴리오 시연영상(2분)](https://www.youtube.com/watch?v=Y-kImm8S-58)

## 깃허브 레포

> FE : [https://github.com/KTB-Sixmen/gitfolio_front](https://github.com/KTB-Sixmen/gitfolio_front)

> BE : [https://github.com/KTB-Sixmen/gitfolio_back_spring](https://github.com/KTB-Sixmen/gitfolio_back_spring)

> AI : [https://github.com/KTB-Sixmen/gitfolio_AI](https://github.com/KTB-Sixmen/gitfolio_AI)

## 프로젝트 기능

**깃트폴리오**는 사용자의 Git 및 Github 데이터를 바탕으로 단 3분만에 이력서를 자동으로 만들어주는 서비스입니다.

- 이력서 초기 작성에 어려움을 느끼는 Github 사용자를 타겟으로 잡았습니다.

## 🌟 1. 랜딩페이지 및 로그인

- 사이트에 접속하면 가장 맨 처음 보여지는 페이지입니다.
- 커뮤니티 페이지는 로그인을 하지 않고도 들어갈 수 있지만 이외의 기능은 로그인 이후 토큰을 발급받아야 정상적으로 이용 가능합니다.

  <details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/bc5572de-41fa-4ffa-a96d-1f9e58540e7a)](https://github.com/user-attachments/assets/bc5572de-41fa-4ffa-a96d-1f9e58540e7a)

</details>

#

## 👨‍💼 2. 온보딩 페이지

### 3-1. 사용자 정보 입력

- 사용자 정보 입력 단계에서는 필수 및 선택 정보를 입력합니다.
- 필수: 신상정보(본명, 이메일, 전화번호, 직군, 프로필사진)
- 선택: 경력, 교육, 자격증, 링크

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/f216257d-5bea-46ed-b8a7-5e6a204ca361)](https://github.com/user-attachments/assets/f216257d-5bea-46ed-b8a7-5e6a204ca361)

</details>

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/75ef712d-ec1e-4a6d-b15d-81a89b40dadb)](https://github.com/user-attachments/assets/75ef712d-ec1e-4a6d-b15d-81a89b40dadb)

</details>

#

### 3-2. 레파지토리 선택(이력서 생성)

- 이력서 항목 중 '프로젝트'에 들어갈 내용을 위한 깃허브 레파지토리를 선택합니다.
- 최대 3개까지 선택가능하며, public 레파지토리만 불러올 수 있습니다. organization 프로젝트의 경우 people에서 public으로 전환해야 불러올 수 있습니다.
- 이력서를 만들 때 요청사항을 적을 수 있고, 커뮤니티에 내 이력서를 공개할지에 대한 여부를 선택할 수도 있습니다.
- 깃트폴리오는 3개의 이력서 템플릿을 제공하고 있습니다.(프로젝트 내용에 따라 구분됨 )
  - BASIC 템플릿: 담당업무
  - STAR 템플릿: 담당업무, STAR(Situation, Task, Action, Result)
  - GITFOLIO 템플릿: 담당업무, 트러블 슈팅(Problem, Hypothesis, Try, Result)

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/0e01b0bb-2940-41d5-afce-8c610734dd1c)](https://github.com/user-attachments/assets/0e01b0bb-2940-41d5-afce-8c610734dd1c)

</details>

#

### 3-3. 이력서 생성 로딩 토스트 메시지

- 이력서 생성이 이루어지는 시간(40초~1분30초) 동안 토스트 메시지를 통해 로딩 UI를 표현하였습니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/0cecc5dc-8c6b-4d6a-81a6-8c9ee7120e52)](https://github.com/user-attachments/assets/0cecc5dc-8c6b-4d6a-81a6-8c9ee7120e52)

</details>

- 네 가지의 상태가 존재합니다.
  - 레파지토리 살펴보는 중 / 프로젝트 검토 중 / 이력서 작성 중 / 성공

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/56b6d782-9553-4748-899e-e55a3ce2b271)](https://github.com/user-attachments/assets/56b6d782-9553-4748-899e-e55a3ce2b271)

</details>

#

## 👥 3. 커뮤니티

### 3-1. 메인 화면

- 커뮤니티 메인 화면에서는 사용자가 올린 이력서들을 한 눈에 리스트 형태로 확인할 수 있습니다.
- 각 이력서에는 좋아요수, 조회수가 표시됩니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/fd30d4d6-20f4-48bb-8e86-2b493d289aec)](https://github.com/user-attachments/assets/fd30d4d6-20f4-48bb-8e86-2b493d289aec)

</details>

#

### 3-2. 이력서 상세 화면 - 이력서 네비게이션

- 이력서의 상세한 내용을 볼 수 있습니다.
- 좋아요수, 조회수가 표시됩니다.
- 이력서 상단에 네비게이션바가 있어 원하는 항목으로 바로 이동할 수 있습니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/d56be3cb-c61b-47df-b2b9-b922228fc8a4)](https://github.com/user-attachments/assets/d56be3cb-c61b-47df-b2b9-b922228fc8a4)

</details>

#

### 3-3. 이력서 상세 화면 - 댓글

- 이력서에 댓글을 작성할 수 있습니다.
- 댓글 삭제 버튼은 작성한 본인에게만 보이며, 삭제 기능 또한 작성자만 가능합니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/e708bb60-7f59-417c-80c4-a6eaa6200449)](https://github.com/user-attachments/assets/e708bb60-7f59-417c-80c4-a6eaa6200449)

</details>

#

### 3-4. 좋아요 기능

- 마음에 드는 이력서에 좋아요를 누를 수 있습니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/30e274d7-e6cf-401a-8416-0f15bfcb6246)](https://github.com/user-attachments/assets/30e274d7-e6cf-401a-8416-0f15bfcb6246)

</details>

### 3-5. 필터링 기능

- 원하는 이력서를 필터링 할 수 있는 메뉴바가 존재합니다.
- 메뉴바 버튼 구성
  - 필터링 초기화
  - 포지션 필터(백엔드, 프론트엔드, 인프라, 게임, AI)
  - 학교 필터(고졸, 대재, 대졸, 대학원, ...)
  - 정렬 기능(최신순, 좋아요 많은 순, 조회수 많은 순)

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/ec0756df-e815-455e-b80e-3aa573339514)](https://github.com/user-attachments/assets/ec0756df-e815-455e-b80e-3aa573339514)

</details>

#

## 4. ✏️ 내 이력서 화면

### 4-1. 내 이력서 - 이력서 PDF 저장

- 이력서 PDF 저장 버튼을 클릭하면 잠시 뒤에 PDF 파일이 사용자 컴퓨터에 저장됩니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/b44046b8-ac3f-41cd-81b7-0b808d1b3ae1)](https://user-images.githubusercontent.com/122663756/233081376-13d464dc-0c57-4e38-8dd1-11feab10213c.gif)

</details>

### 4-2. 내 이력서 - 직접 수정

- 내 이력서의 내용을 사용자가 직접 수정하는 화면입니다.
- 리스트 형태의 내용인 '담당업무'와 '기술 스택'의 경우 추가 삭제 버튼이 존재합니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/bffa32af-9050-4657-867e-9ee8f7ae99d3)](https://github.com/user-attachments/assets/bffa32af-9050-4657-867e-9ee8f7ae99d3)

</details>

#

### 4-3. 내 이력서 - AI 수정

- 내 이력서의 내용을 사용자가 직접 수정하는 화면입니다.
- 리스트 형태의 내용인 '담당업무'와 '기술 스택'의 경우 추가 삭제 버튼이 존재합니다.

<details>
  <summary>이미지 더보기</summary>

[![](https://github.com/user-attachments/assets/bffa32af-9050-4657-867e-9ee8f7ae99d3)](https://github.com/user-attachments/assets/bffa32af-9050-4657-867e-9ee8f7ae99d3)

</details>

#

## FE 적용 기술

### 기술 구현(라이브러리 미사용)

### []()☑ AI 이력서 수정 팝오버 컴포넌트

> 드래그 앤 드롭 기능을 도입함으로써 UX 경험을 향상시킬것으로 기대 되었고, 타 웹사이트에서 이미 많이 도입하고 있으므로 시장에서의 경쟁력을 유지하고자 결정하였습니다. 또한 자바스크립트에서 이미 드래그앤 드롭 기능을 내장하고 있기 때문에 웹 애플리케이션의 구조와 디자인이 이미지 드래그 앤 드롭 기능을 적용하기에 적합하다고 판단하였습니다.
>
> #

### []()☑ infinite scroll

> 사용자가 페이지를 탐색하여 필요한 데이터만 로드되기 때문에 서버와 클라이언트 사이의 데이터 전송량이 현저히 줄어들 수 있어 효율성이 향상되어 선택했습니다.
>
> #

### 기술 구현(라이브러리 사용)

### []()☑ mem

> Refresh Token을 사용해 AccessToken을 재발급 받을때 사용자가 동일한 시간에 여러개의 요청을 보낼시 서로 다른 2개의 Access Token이 발급되기 때문에 메모이제이션 기능이 필요했지만 함수형 컴포넌트가 아닌곳에서 useCallback,useMemo hook을 사용할수 없기 때문에 메모이제이션 기능을 라이브러리로 도입했습니다.
>
> #

## FE 트러블 슈팅

## 서비스 아키텍쳐

[![](https://github.com/user-attachments/assets/2d909380-bb8e-458e-82bc-a29bda81de44)](https://github.com/user-attachments/assets/2d909380-bb8e-458e-82bc-a29bda81de44)
