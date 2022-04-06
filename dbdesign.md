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
만약 레포트가 어떤 field나 quest에 연관되어서 제출되었는데 그것이 삭제되었다면 그것은 표시되지 않는다.