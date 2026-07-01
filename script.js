document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const successModal = document.getElementById('successModal');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    
    // 입력 필드 요소들
    const fields = {
        userId: {
            input: document.getElementById('userId'),
            error: document.getElementById('userIdError'),
            validate: (value) => {
                if (!value) return '아이디를 입력해 주세요.';
                const regex = /^[a-z0-9]{5,20}$/;
                if (!regex.test(value)) {
                    return '아이디는 5~20자의 영문 소문자, 숫자만 사용 가능합니다.';
                }
                return '';
            }
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('passwordError'),
            validate: (value) => {
                if (!value) return '비밀번호를 입력해 주세요.';
                const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
                if (!regex.test(value)) {
                    return '비밀번호는 8~20자의 영문, 숫자, 특수문자(@$!%*#?&) 조합이어야 합니다.';
                }
                return '';
            }
        },
        passwordConfirm: {
            input: document.getElementById('passwordConfirm'),
            error: document.getElementById('passwordConfirmError'),
            validate: (value) => {
                if (!value) return '비밀번호 확인을 입력해 주세요.';
                // 안전하게 DOM에서 직접 비밀번호 값을 읽어옵니다.
                const passwordInput = document.getElementById('password');
                const passwordVal = passwordInput ? passwordInput.value : '';
                if (value !== passwordVal) {
                    return '비밀번호가 일치하지 않습니다.';
                }
                return '';
            }
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (value) => {
                if (!value) return '이메일을 입력해 주세요.';
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!regex.test(value)) {
                    return '올바른 이메일 형식이 아닙니다. (예: example@yju.ac.kr)';
                }
                return '';
            }
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('phoneError'),
            validate: (value) => {
                if (!value) return '전화번호를 입력해 주세요.';
                const regex = /^010-\d{3,4}-\d{4}$/;
                if (!regex.test(value)) {
                    return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
                }
                return '';
            }
        }
    };

    // 실시간 유효성 검사 적용 및 에러 메시지 업데이트 함수
    function validateField(fieldKey) {
        const field = fields[fieldKey];
        if (!field || !field.input) return false;
        
        const errorMessage = field.validate(field.input.value.trim());
        
        if (errorMessage) {
            field.error.textContent = errorMessage;
            field.error.className = 'validation-message error';
            field.input.style.borderColor = 'var(--yju-accent)';
            return false;
        } else {
            field.error.textContent = '사용 가능한 입력값입니다.';
            field.error.className = 'validation-message success';
            field.input.style.borderColor = 'var(--yju-success)';
            return true;
        }
    }

    // 각 입력창에 blur 및 input 이벤트 바인딩
    Object.keys(fields).forEach((key) => {
        const field = fields[key];
        if (!field || !field.input) return;
        
        // 입력하는 도중 또는 포커스를 잃었을 때 검증 진행
        field.input.addEventListener('input', () => {
            // 전화번호 입력창의 경우 자동으로 대시(-) 추가
            if (key === 'phone') {
                formatPhoneNumber(field.input);
            }
            validateField(key);
        });

        field.input.addEventListener('blur', () => {
            validateField(key);
        });
    });

    // 비밀번호가 수정되면 비밀번호 확인도 실시간으로 다시 유효성 검사
    const passwordInputEl = fields.password.input;
    if (passwordInputEl) {
        passwordInputEl.addEventListener('input', () => {
            const confirmVal = fields.passwordConfirm.input.value;
            if (confirmVal) {
                validateField('passwordConfirm');
            }
        });
    }

    // 전화번호 자동 하이픈(-) 포맷터 함수
    function formatPhoneNumber(input) {
        let value = input.value.replace(/[^0-9]/g, '');
        if (value.length > 11) {
            value = value.substr(0, 11);
        }
        
        let formatted = '';
        if (value.length < 4) {
            formatted = value;
        } else if (value.length < 7) {
            formatted = value.substr(0, 3) + '-' + value.substr(3);
        } else if (value.length < 11) {
            formatted = value.substr(0, 3) + '-' + value.substr(3, 3) + '-' + value.substr(6);
        } else {
            formatted = value.substr(0, 3) + '-' + value.substr(3, 4) + '-' + value.substr(7);
        }
        
        input.value = formatted;
    }

    // 폼 제출 이벤트 핸들링
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 기본 서버 전송 방지

        let isAllValid = true;
        
        // 모든 필드 순회하며 검증 수행
        Object.keys(fields).forEach((key) => {
            const isValid = validateField(key);
            if (!isValid) {
                isAllValid = false;
            }
        });

        // 모든 입력값이 올바른 경우 가입 완료 모달 표시
        if (isAllValid) {
            showSuccessModal();
        } else {
            // 에러가 있는 첫 번째 필드 찾기 (직관적인 텍스트 비교 사용)
            const firstErrorKey = Object.keys(fields).find(key => {
                const errorMsg = fields[key].validate(fields[key].input.value.trim());
                return errorMsg !== '';
            });
            
            if (firstErrorKey && fields[firstErrorKey].input) {
                fields[firstErrorKey].input.focus();
            }
        }
    });

    // 성공 모달 표시 함수
    function showSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
        }
    }

    // 모달 확인 버튼 클릭 시 환영 페이지로 이동
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.classList.remove('active');
            }
            window.location.href = 'welcome.html';
        });
    }
});
