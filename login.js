document.addEventListener('DOMContentLoaded', () => {
    // Supabase 클라이언트 초기화
    const supabaseUrl = 'https://rktugcrdyhmpavvvboac.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdHVnY3JkeWhtcGF2dnZib2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTkxNjQsImV4cCI6MjA5ODQzNTE2NH0.RsdRItVWxDL1OfK7ydhwTv-6qjrDyd9ermlYNDUVW0o';
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    const loginForm = document.getElementById('loginForm');
    const successModal = document.getElementById('successModal');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');

    // 입력 필드 요소들
    const fields = {
        userId: {
            input: document.getElementById('userId'),
            error: document.getElementById('userIdError')
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('passwordError')
        }
    };

    // 에러 표시 기능
    function showError(fieldKey, message) {
        const field = fields[fieldKey];
        if (field) {
            field.error.textContent = message;
            field.error.className = 'validation-message error';
            field.input.style.borderColor = 'var(--yju-accent)';
        }
    }

    // 에러 클리어 기능
    function clearError(fieldKey) {
        const field = fields[fieldKey];
        if (field) {
            field.error.textContent = '';
            field.error.className = 'validation-message';
            field.input.style.borderColor = 'var(--border-color)';
        }
    }

    // 실시간 입력 감지하여 에러 제거
    Object.keys(fields).forEach(key => {
        fields[key].input.addEventListener('input', () => {
            clearError(key);
        });
    });

    // 로그인 폼 제출 처리
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userIdVal = fields.userId.input.value.trim();
        const passwordVal = fields.password.input.value.trim();

        let hasError = false;

        // 필수 입력값 검증
        if (!userIdVal) {
            showError('userId', '아이디를 입력해 주세요.');
            hasError = true;
        }
        if (!passwordVal) {
            showError('password', '비밀번호를 입력해 주세요.');
            hasError = true;
        }

        if (hasError) {
            // 첫 번째 에러 필드 포커스
            if (!userIdVal) fields.userId.input.focus();
            else if (!passwordVal) fields.password.input.focus();
            return;
        }

        const submitBtn = loginForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        try {
            // 버튼 비활성화 및 로딩 애니메이션
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>로그인 중...</span><i class="fa-solid fa-spinner fa-spin"></i>';

            if (!supabase) {
                throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
            }

            // DB에서 회원 조회
            const { data, error } = await supabase
                .from('member')
                .select('*')
                .eq('user_id', userIdVal)
                .eq('password', passwordVal);

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                // 로그인 실패 (일치하는 회원 없음)
                showError('userId', '아이디 또는 비밀번호가 올바르지 않습니다.');
                showError('password', '');
                fields.userId.input.focus();
            } else {
                // 로그인 성공 시 세션 저장
                sessionStorage.setItem('loggedInUser', userIdVal);
                // 로그인 성공 모달 활성화
                if (successModal) {
                    successModal.classList.add('active');
                }
            }
        } catch (err) {
            console.error(err);
            alert('로그인 처리 중 오류가 발생했습니다: ' + err.message);
        } finally {
            // 버튼 상태 복구
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // 로그인 성공 모달 확인 버튼 클릭 시 환영 페이지로 이동
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.classList.remove('active');
            }
            window.location.href = 'welcome.html';
        });
    }
});
