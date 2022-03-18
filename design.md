# 페이지 디자인
|머릿글||
|---|---|
|활동바|본문|
|바닥글|

머릿글에는 고객이 원하는 것을 집어넣음 가령 회사명, 검색창 등이 자리할 수 있다.  
바닥글에는 회사 주소나 전화번호, 이메일 등을 표기한다.  
머릿글과 바닥글은 한 ejs페이지에 수록하고 기본 레이아웃으로 지정하지만 활동바는 따로 첨가하는 방식을 채택한다.

## 본문 및 하위 css 구성
기본 단위는 container이며, 이곳에 내용을 담는다. 본문의 css 구성은 아래와 같다.  
``` 
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-items: flex-start;
```
container의 css 구성은 내용에 밀착하는 형태로, 아래와 같다. 반응형때 최소단위를 조절하여야 할 것 이다.
```
flex-basis:최소단위
```

## User Manage 페이지
페이지 한 단에 유저 정보를 포함하며 수정 버튼을 누르면 유저 수정 div를 열고 그 외에 disable한다.  
유저 퍼미션의 경우는 listbox에 나열하고 combobox:combobox 형식으로 팀:권한을 나타낸다.  
버튼 트리깅으로 일괄 수정한다.  

## 보고서 양식 생성
생성 컨테이너, 미리보기 컨테이너, 필드 추가 컨테이너, 필드 수정(삭제, 변경) 컨테이너가 존재한다.  
무엇인지 나타내는 필드, 값을 어떤 방식으로 입력해야하는 필드로 나뉜다.  
리스트박스:리스트박스 형식으로 보이게 된다.
```
필드 선택 : 입력 방식 선택
```
### 보고서 필드 생성
필드를 추가한다. 이때 생성되는 필드는 ajax 통신으로 바로 그것의 id가 전송되어진다.  
필드 업데이트 또한 가능해야 한다.

# 인터렉션 디자인
## 메인
메인에서는 관리자로 로그인 한 경우 보고서들을 표시하고, 아니라면 보고하는 화면을 띄운다.
관리자라면 보고서 양식 추가 버튼이 활동바에 위치한다.

## 로그인
로그인과 로그아웃 페이지는 login 페이지에서 이루어진다. 모든 페이지(login제외)는 body onload 에 따로 onload.js 를 불러와서 그것에 로그인 여부를 확인하는 함수를 지정해야 한다. 만약 로그인되어지지 않았다면 login 페이지로 이동하는 ``` document.location.href ``` 스크립트를 짠다.  
### JWT
팀 접근 권한, 아이디, 소속팀이 있다. 팀 접근 권한의 종류는 쉼표로 구분되어진다. 띄어쓰고 열람 및 수정 여부를 지정해야 한다.

## 보고서 양식 생성
보고서 양식을 생성하기 위해서는 필드를 추가하고 그것의 입력 타입을 정하는 것 이다. 이렇게 만들어진 것은 db에 form inner html이 저장된다. 또, 필드는 따로 저장된다.

## 보고서 제출
보고서 제출은 manager가 직접 설정한 보고서 양식에 맞추어 이루어진다. 다양한 필드를 설정하고 필드의 값의 타입을 설정한다. 또, 받을 파일에 대해서도 설정할 수 있어야 한다.  
보고서를 제출하기 위해서는 활동바의 팀에 들어가야 한다. 이때 팀 쓰기 권한이 있어야 한다. 

# 데이터베이스 디자인
sqlite3 를 사용한다.
## 유저
id INTEGER PRIMARY KEY AUTOINCREMENT, manager INTEGER, email TEXT, password TEXT, permission TEXT, team TEXT
permission 는 1 R,5 RW 꼴의 문자열, 각각 1팀 읽기 가능, 5팀 읽기쓰기 가능이다.  
team는 소속팀이고, team table의 id 이다. 이 구조에서 유저의 team은 부차적 요소이고, 직접적인 접근에 영향을 미치는 것은 permission 이다.
## 팀
id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT
## 보고서 양식
id INTEGER PRIMARY KEY AUTOINCREMENT, quests TEXT
보고서 양식 생성 페이지에서 추가한 quest를 id로, 아래와 같다.
```
1 2 3 4
```
보고서 양식을 제출할때는 quest Id에 맞는 해당 name을 가진 input 필드의 value를 questId:value 꼴로 저장한 것을 제출한다.
### 보고서 양식 필드
보고서 양식은 필드와 입력값으로 구성되는데, 그 필드에 대한 정보를 db에 기록해둔다.  
id INTEGER PRIMARY KEY AUTOINCREMENT, field TEXT  
id는 제출되는 보고서 form data의 name이 될 것 이다.
### 보고서 양식 퀘스트
id INTEGER PRIMARY KEY AUTOINCREMENT, fieldId TEXT, submitType TEXT
필드와 제출 타입으로 이루어져 있다.
## 보고서 제출
id INTEGER PRIMARY KEY AUTOINCREMENT, reporter INTEGER, reportform INTEGER, data TEXT, date TEXT 
reportform에 맞는 올바른 data가 필요한데, json 으로 저장한다.

## 데이터 베이스 유기적 상호작용
field가 지워지면 그것이 사용된 quest가 지워진다.  
quest가 지워지면 form에 존재하는 그 quest id도 지워진다.