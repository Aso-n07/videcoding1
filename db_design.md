# 데이터베이스(DB) 설계 문서

본 문서는 영진전문대학교 회원가입 페이지에서 수집하는 회원 정보를 저장하기 위한 데이터베이스(RDBMS 기준) 테이블 설계서입니다.

---

## 1. 테이블 정의 (Table Definition)

### 테이블명: `member` (회원 테이블)
- **설명**: 회원가입을 통해 등록된 사용자의 기본 정보를 관리하는 테이블입니다.

| 순서 | 컬럼명 (Physical) | 논리명 (Logical) | 데이터 타입 (Type) | 제약조건 (Constraints) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `number` | 일련번호 | `INT` | PRIMARY KEY, AUTO_INCREMENT | 고유 식별 번호 (자동 증가) |
| 2 | `user_id` | 아이디 | `VARCHAR(50)` | UNIQUE, NOT NULL | 사용자 로그인 ID |
| 3 | `password` | 비밀번호 | `VARCHAR(255)` | NOT NULL | 사용자 비밀번호 (단방향 해시 암호화 저장 권장) |
| 4 | `email` | 이메일 | `VARCHAR(100)` | NOT NULL | 사용자 이메일 주소 |
| 5 | `phone` | 전화번호 | `VARCHAR(20)` | NOT NULL | 사용자 연락처 (예: 010-0000-0000) |

---

## 2. 테이블 생성 SQL (DDL)

데이터베이스 시스템(MySQL / MariaDB 등)에서 테이블을 생성하기 위한 SQL 쿼리문입니다.

```sql
CREATE TABLE `member` (
    `number` INT AUTO_INCREMENT COMMENT '일련번호 (PK)',
    `user_id` VARCHAR(50) NOT NULL COMMENT '사용자 아이디',
    `password` VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
    `email` VARCHAR(100) NOT NULL COMMENT '이메일 주소',
    `phone` VARCHAR(20) NOT NULL COMMENT '전화번호',
    PRIMARY KEY (`number`),
    UNIQUE KEY `ux_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 테이블';
```

---

## 3. 필드 설명 및 설계 고려사항

1. **`number` (일련번호)**
   - 각 회원을 고유하게 식별하기 위한 대리키(Surrogate Key)입니다.
   - `AUTO_INCREMENT` 속성을 통해 신규 회원이 가입할 때마다 자동으로 1씩 증가합니다.
   
2. **`user_id` (아이디)**
   - 사용자가 로그인 시 사용할 식별자입니다.
   - 중복 가입을 방지하기 위해 `UNIQUE` 제약조건을 부여합니다.
   - 영문 및 숫자 조합의 5~20자 수준으로 제한하는 비즈니스 로직에 맞게 `VARCHAR(50)`으로 크기를 정의했습니다.

3. **`password` (비밀번호)**
   - 보안을 위해 비밀번호는 반드시 평문(Plain Text)이 아닌 **단방향 해시 알고리즘(예: bcrypt, SHA-256 등)**으로 암호화하여 저장해야 합니다.
   - 해시값의 길이를 고려하여 충분한 크기인 `VARCHAR(255)`로 지정했습니다.

4. **`email` (이메일)**
   - 비밀번호 분실 시 찾기 기능이나 알림 발송 등을 위해 수집합니다.
   - 이메일 주소의 최대 표준 규격(RFC 5321)에 부합하도록 `VARCHAR(100)`으로 설정하였습니다.

5. **`phone` (전화번호)**
   - 본인 인증 또는 연락 목적의 번호입니다.
   - 대시(`-`)를 포함하여 저장할 수 있도록 문자열 형식인 `VARCHAR(20)`으로 설정하였습니다.
