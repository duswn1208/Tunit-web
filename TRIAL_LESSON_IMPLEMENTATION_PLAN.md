# 체험 레슨 후보 시간 선택 기능 구현 플랜

> **목표:** 체험/상담 레슨 예약 시 학생이 2~3개 후보 시간을 제안하고, 튜터가 선택하거나 대안을 제안하는 기능 추가

---

## 📋 Phase 별 구현 계획

---

## 🔴 **Phase 1: Database & Entity (1일차)**

### 1.1 Database Migration

**파일:** `src/main/resources/db/migration/V{version}__add_trial_contract_candidates.sql`

```sql
-- 체험 레슨 후보 시간 테이블
CREATE TABLE trial_contract_candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_no BIGINT NOT NULL,
    priority INT NOT NULL CHECK (priority BETWEEN 1 AND 3),
    candidate_date DATE NOT NULL,
    candidate_start_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_trial_candidates_contract 
        FOREIGN KEY (contract_no) 
        REFERENCES student_tutor_contract(contract_no) 
        ON DELETE CASCADE,
    
    CONSTRAINT unique_contract_priority 
        UNIQUE (contract_no, priority),
    
    CONSTRAINT unique_contract_datetime 
        UNIQUE (contract_no, candidate_date, candidate_start_time)
);

CREATE INDEX idx_trial_candidates_contract 
ON trial_contract_candidates(contract_no);

CREATE INDEX idx_trial_candidates_available 
ON trial_contract_candidates(contract_no, is_available);

-- 튜터 제안 시간 테이블
CREATE TABLE trial_contract_proposals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_no BIGINT NOT NULL,
    proposed_date DATE NOT NULL,
    proposed_start_time TIME NOT NULL,
    is_accepted BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_trial_proposals_contract
        FOREIGN KEY (contract_no)
        REFERENCES student_tutor_contract(contract_no)
        ON DELETE CASCADE
);

CREATE INDEX idx_trial_proposals_contract 
ON trial_contract_proposals(contract_no);

CREATE INDEX idx_trial_proposals_pending 
ON trial_contract_proposals(contract_no, is_accepted);

-- StudentTutorContract 테이블에 컬럼 추가 (선택사항)
ALTER TABLE student_tutor_contract
ADD COLUMN selected_candidate_date DATE DEFAULT NULL,
ADD COLUMN selected_candidate_time TIME DEFAULT NULL;
```

### 1.2 Entity 생성

**파일 1:** `src/main/java/com/tunit/domain/contract/entity/TrialContractCandidate.java`

```java
package com.tunit.domain.contract.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "trial_contract_candidates")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TrialContractCandidate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_no", nullable = false)
    private StudentTutorContract contract;
    
    @Column(nullable = false)
    private Integer priority;  // 1, 2, 3
    
    @Column(name = "candidate_date", nullable = false)
    private LocalDate candidateDate;
    
    @Column(name = "candidate_start_time", nullable = false)
    private LocalTime candidateStartTime;
    
    @Setter
    @Column(name = "is_available")
    private Boolean isAvailable;  // 튜터 스케줄 체크 결과
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public static TrialContractCandidate of(
        StudentTutorContract contract,
        Integer priority,
        LocalDate date,
        LocalTime time
    ) {
        return TrialContractCandidate.builder()
            .contract(contract)
            .priority(priority)
            .candidateDate(date)
            .candidateStartTime(time)
            .build();
    }
    
    public boolean isAvailable() {
        return Boolean.TRUE.equals(isAvailable);
    }
}
```

**파일 2:** `src/main/java/com/tunit/domain/contract/entity/TrialContractProposal.java`

```java
package com.tunit.domain.contract.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "trial_contract_proposals")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TrialContractProposal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_no", nullable = false)
    private StudentTutorContract contract;
    
    @Column(name = "proposed_date", nullable = false)
    private LocalDate proposedDate;
    
    @Column(name = "proposed_start_time", nullable = false)
    private LocalTime proposedStartTime;
    
    @Setter
    @Column(name = "is_accepted")
    private Boolean isAccepted;  // null: 대기, true: 수락, false: 거절
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public static TrialContractProposal of(
        StudentTutorContract contract,
        LocalDate date,
        LocalTime time
    ) {
        return TrialContractProposal.builder()
            .contract(contract)
            .proposedDate(date)
            .proposedStartTime(time)
            .build();
    }
}
```

**파일 3:** `src/main/java/com/tunit/domain/contract/entity/StudentTutorContract.java` (수정)

```java
// 기존 파일에 추가

// 필드 추가
@OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
private List<TrialContractCandidate> trialCandidates = new ArrayList<>();

@OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
private List<TrialContractProposal> trialProposals = new ArrayList<>();

@Column(name = "selected_candidate_date")
private LocalDate selectedCandidateDate;

@Column(name = "selected_candidate_time")
private LocalTime selectedCandidateTime;

// 메서드 추가
public boolean isTrial() {
    return this.contractType == ContractType.TRIAL;
}

public void confirmTrialTime(LocalDate date, LocalTime time) {
    if (!this.isTrial()) {
        throw new ContractException("체험 레슨이 아닙니다");
    }
    this.selectedCandidateDate = date;
    this.selectedCandidateTime = time;
    this.contractStatus = ContractStatus.ACTIVE;
    this.startDt = date;
    this.endDt = date;
    this.updatedAt = LocalDateTime.now();
}
```

### 1.3 Repository 생성

**파일 1:** `src/main/java/com/tunit/domain/contract/repository/TrialContractCandidateRepository.java`

```java
package com.tunit.domain.contract.repository;

import com.tunit.domain.contract.entity.TrialContractCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrialContractCandidateRepository extends JpaRepository<TrialContractCandidate, Long> {
    
    List<TrialContractCandidate> findByContract_ContractNo(Long contractNo);
    
    List<TrialContractCandidate> findByContract_ContractNoOrderByPriority(Long contractNo);
    
    Optional<TrialContractCandidate> findByContract_ContractNoAndCandidateDateAndCandidateStartTime(
        Long contractNo,
        LocalDate date,
        LocalTime time
    );
    
    long countByContract_ContractNo(Long contractNo);
}
```

**파일 2:** `src/main/java/com/tunit/domain/contract/repository/TrialContractProposalRepository.java`

```java
package com.tunit.domain.contract.repository;

import com.tunit.domain.contract.entity.TrialContractProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrialContractProposalRepository extends JpaRepository<TrialContractProposal, Long> {
    
    List<TrialContractProposal> findByContract_ContractNo(Long contractNo);
    
    List<TrialContractProposal> findByContract_ContractNoAndIsAcceptedIsNull(Long contractNo);
}
```

---

## 🟡 **Phase 2: DTO 작성 (2일차)**

### 2.1 기존 DTO 확장

**파일:** `src/main/java/com/tunit/domain/contract/dto/ContractCreateRequestDto.java` (수정)

```java
// 기존 클래스에 추가

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractCreateRequestDto {
    // ... 기존 필드들 ...
    
    // 체험 레슨용 후보 시간 (신규 추가)
    private List<TrialCandidateTime> trialCandidates;
    
    // Inner class 추가
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrialCandidateTime {
        private Integer priority;  // 1, 2, 3
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate candidateDate;
        
        @JsonFormat(pattern = "HH:mm")
        private LocalTime candidateStartTime;
    }
    
    // 메서드 추가
    public boolean isTrial() {
        return contractType != null && contractType.isTrial();
    }
    
    public boolean hasTrialCandidates() {
        return trialCandidates != null && !trialCandidates.isEmpty();
    }
}
```

### 2.2 새 DTO 생성

**파일 1:** `src/main/java/com/tunit/domain/contract/dto/TrialConfirmDto.java`

```java
package com.tunit.domain.contract.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrialConfirmDto {
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate selectedDate;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime selectedStartTime;
}
```

**파일 2:** `src/main/java/com/tunit/domain/contract/dto/TrialRejectDto.java`

```java
package com.tunit.domain.contract.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrialRejectDto {
    
    private String reason;  // 거절 사유
    
    // 대안 시간 제안 (선택사항)
    private List<AlternativeTime> alternativeTimes;
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AlternativeTime {
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate proposedDate;
        
        @JsonFormat(pattern = "HH:mm")
        private LocalTime proposedStartTime;
    }
    
    public boolean hasAlternatives() {
        return alternativeTimes != null && !alternativeTimes.isEmpty();
    }
}
```

### 2.3 Response DTO 확장

**파일:** `src/main/java/com/tunit/domain/contract/dto/ContractResponseDto.java` (수정)

```java
// 기존 클래스에 필드 추가

@Getter
@Builder
public class ContractResponseDto {
    // ... 기존 필드들 ...
    
    // 체험 레슨 관련 추가
    private List<CandidateTimeInfo> trialCandidates;      // 학생이 제안한 후보
    private List<ProposalTimeInfo> tutorProposals;        // 튜터가 제안한 대안
    private LocalDate selectedCandidateDate;              // 확정된 날짜
    private LocalTime selectedCandidateTime;              // 확정된 시간
    
    @Getter
    @Builder
    public static class CandidateTimeInfo {
        private Long id;
        private Integer priority;
        private LocalDate candidateDate;
        private LocalTime candidateStartTime;
        private Boolean isAvailable;
    }
    
    @Getter
    @Builder
    public static class ProposalTimeInfo {
        private Long id;
        private LocalDate proposedDate;
        private LocalTime proposedStartTime;
        private Boolean isAccepted;  // null: 대기, true: 수락, false: 거절
    }
    
    // from() 메서드 수정 - 체험 레슨 데이터 포함
    public static ContractResponseDto from(StudentTutorContract contract) {
        ContractResponseDtoBuilder builder = ContractResponseDto.builder()
            // ... 기존 필드 매핑 ...
            .selectedCandidateDate(contract.getSelectedCandidateDate())
            .selectedCandidateTime(contract.getSelectedCandidateTime());
        
        // 체험 레슨인 경우 후보/제안 데이터 추가
        if (contract.isTrial() && contract.getTrialCandidates() != null) {
            builder.trialCandidates(
                contract.getTrialCandidates().stream()
                    .map(c -> CandidateTimeInfo.builder()
                        .id(c.getId())
                        .priority(c.getPriority())
                        .candidateDate(c.getCandidateDate())
                        .candidateStartTime(c.getCandidateStartTime())
                        .isAvailable(c.getIsAvailable())
                        .build()
                    )
                    .collect(Collectors.toList())
            );
        }
        
        if (contract.isTrial() && contract.getTrialProposals() != null) {
            builder.tutorProposals(
                contract.getTrialProposals().stream()
                    .map(p -> ProposalTimeInfo.builder()
                        .id(p.getId())
                        .proposedDate(p.getProposedDate())
                        .proposedStartTime(p.getProposedStartTime())
                        .isAccepted(p.getIsAccepted())
                        .build()
                    )
                    .collect(Collectors.toList())
            );
        }
        
        return builder.build();
    }
}
```

---

## 🟠 **Phase 2: Service 메서드 추가 (3일차)**

**파일:** `src/main/java/com/tunit/domain/contract/service/ContractService.java` (수정)

### 2.1 의존성 추가

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {
    
    // 기존 의존성들...
    private final StudentTutorContractRepository contractRepository;
    private final ContractScheduleRepository scheduleRepository;
    
    // 새로 추가
    private final TrialContractCandidateRepository trialCandidateRepository;
    private final TrialContractProposalRepository trialProposalRepository;
    private final TutorScheduleService tutorScheduleService;
    private final NotificationService notificationService;
    
    // ... 기존 메서드들 ...
```

### 2.2 체험 레슨 생성 메서드

```java
/**
 * 체험 레슨 계약 생성
 */
@Transactional
public ContractResponseDto createTrialContract(ContractCreateRequestDto dto) {
    log.info("체험 레슨 계약 생성 시작 - tutorProfileNo: {}, studentNo: {}", 
        dto.getTutorProfileNo(), dto.getStudentNo());
    
    // 1. 후보 시간 검증
    validateTrialCandidates(dto.getTrialCandidates());
    
    // 2. Contract 생성
    StudentTutorContract contract = StudentTutorContract.builder()
        .tutorProfileNo(dto.getTutorProfileNo())
        .studentNo(dto.getStudentNo())
        .contractType(ContractType.TRIAL)
        .lessonSubCategory(dto.getLessonCategory())
        .lessonCount(1)
        .lessonName(dto.generateLessonName())
        .totalPrice(dto.getTotalPrice())
        .level(dto.getLevel())
        .place(dto.getPlace())
        .emergencyContact(dto.getEmergencyContact())
        .memo(dto.getMemo())
        .contractStatus(ContractStatus.PENDING)
        .source(dto.getSource())
        .build();
    
    contract = contractRepository.save(contract);
    
    // 3. 후보 시간들 저장
    List<TrialContractCandidate> candidates = saveTrialCandidates(
        contract,
        dto.getTrialCandidates()
    );
    
    // 4. 각 후보 시간의 가용성 체크
    checkAndUpdateCandidateAvailability(dto.getTutorProfileNo(), candidates);
    
    // 5. 튜터에게 알림
    sendTrialLessonNotification(contract, candidates);
    
    log.info("체험 레슨 계약 생성 완료 - contractNo: {}", contract.getContractNo());
    
    return ContractResponseDto.from(contract);
}
```

### 2.3 체험 레슨 확정 메서드

```java
/**
 * 체험 레슨 시간 확정 (튜터가 후보 중 선택)
 */
@Transactional
public ContractResponseDto confirmTrialContract(
    Long contractNo,
    Long tutorProfileNo,
    TrialConfirmDto dto
) {
    log.info("체험 레슨 확정 - contractNo: {}", contractNo);
    
    // 1. Contract 조회
    StudentTutorContract contract = contractRepository.findById(contractNo)
        .orElseThrow(() -> new ContractException("계약을 찾을 수 없습니다"));
    
    // 2. 권한 체크
    if (!contract.getTutorProfileNo().equals(tutorProfileNo)) {
        throw new ContractException("권한이 없습니다");
    }
    
    // 3. 타입 및 상태 체크
    if (!contract.isTrial()) {
        throw new ContractException("체험 레슨이 아닙니다");
    }
    
    if (contract.getContractStatus() != ContractStatus.PENDING) {
        throw new ContractException("이미 처리된 계약입니다");
    }
    
    // 4. 후보 시간 조회
    List<TrialContractCandidate> candidates = trialCandidateRepository
        .findByContract_ContractNoOrderByPriority(contractNo);
    
    if (candidates.isEmpty()) {
        throw new ContractException("후보 시간이 없습니다");
    }
    
    // 5. 선택한 시간 검증
    TrialContractCandidate selected = candidates.stream()
        .filter(c ->
            c.getCandidateDate().equals(dto.getSelectedDate()) &&
            c.getCandidateStartTime().equals(dto.getSelectedStartTime())
        )
        .findFirst()
        .orElseThrow(() -> new ContractException("유효하지 않은 시간입니다"));
    
    if (!selected.isAvailable()) {
        throw new ContractException("선택한 시간은 불가능합니다");
    }
    
    // 6. Contract 확정
    contract.confirmTrialTime(dto.getSelectedDate(), dto.getSelectedStartTime());
    contract = contractRepository.save(contract);
    
    // 7. 선택되지 않은 후보들 삭제
    List<TrialContractCandidate> toDelete = candidates.stream()
        .filter(c -> !c.getId().equals(selected.getId()))
        .collect(Collectors.toList());
    trialCandidateRepository.deleteAll(toDelete);
    
    log.info("체험 레슨 확정 완료 - contractNo: {}", contractNo);
    
    return ContractResponseDto.from(contract);
}
```

### 2.4 체험 레슨 거절 메서드

```java
/**
 * 체험 레슨 거절 (+ 대안 시간 제안)
 */
@Transactional
public ContractResponseDto rejectTrialContract(
    Long contractNo,
    Long tutorProfileNo,
    TrialRejectDto dto
) {
    log.info("체험 레슨 거절 - contractNo: {}, hasAlternatives: {}", 
        contractNo, dto.hasAlternatives());
    
    // 1. Contract 조회 및 권한 체크
    StudentTutorContract contract = contractRepository.findById(contractNo)
        .orElseThrow(() -> new ContractException("계약을 찾을 수 없습니다"));
    
    if (!contract.getTutorProfileNo().equals(tutorProfileNo)) {
        throw new ContractException("권한이 없습니다");
    }
    
    if (!contract.isTrial()) {
        throw new ContractException("체험 레슨이 아닙니다");
    }
    
    // 2. 대안 시간 제안이 있는 경우
    if (dto.hasAlternatives()) {
        return rejectWithAlternatives(contract, dto);
    }
    
    // 3. 단순 거절
    return rejectWithoutAlternatives(contract, dto.getReason());
}

/**
 * 학생이 튜터 제안 시간 수락
 */
@Transactional
public ContractResponseDto acceptTutorProposal(
    Long contractNo,
    Long studentNo,
    Long proposalId
) {
    log.info("튜터 제안 시간 수락 - contractNo: {}, proposalId: {}", 
        contractNo, proposalId);
    
    // 1. Contract 조회 및 권한 체크
    StudentTutorContract contract = contractRepository.findById(contractNo)
        .orElseThrow(() -> new ContractException("계약을 찾을 수 없습니다"));
    
    if (!contract.getStudentNo().equals(studentNo)) {
        throw new ContractException("권한이 없습니다");
    }
    
    // 2. Proposal 조회
    TrialContractProposal proposal = trialProposalRepository.findById(proposalId)
        .orElseThrow(() -> new ContractException("제안 시간을 찾을 수 없습니다"));
    
    if (!proposal.getContract().getContractNo().equals(contractNo)) {
        throw new ContractException("유효하지 않은 제안입니다");
    }
    
    // 3. Contract 확정
    contract.confirmTrialTime(
        proposal.getProposedDate(),
        proposal.getProposedStartTime()
    );
    contract = contractRepository.save(contract);
    
    // 4. Proposal 수락 처리
    proposal.setIsAccepted(true);
    trialProposalRepository.save(proposal);
    
    // 5. 나머지 제안들 거절 처리
    List<TrialContractProposal> otherProposals = trialProposalRepository
        .findByContract_ContractNoAndIsAcceptedIsNull(contractNo);
    
    otherProposals.stream()
        .filter(p -> !p.getId().equals(proposalId))
        .forEach(p -> p.setIsAccepted(false));
    
    trialProposalRepository.saveAll(otherProposals);
    
    log.info("튜터 제안 시간 수락 완료 - contractNo: {}", contractNo);
    
    return ContractResponseDto.from(contract);
}
```

### 2.5 Private 헬퍼 메서드들

```java
// ========== Private 헬퍼 메서드들 ==========

private void validateTrialCandidates(
    List<ContractCreateRequestDto.TrialCandidateTime> candidates
) {
    if (candidates == null || candidates.isEmpty()) {
        throw new ContractException("최소 1개의 후보 시간을 선택해주세요");
    }
    
    if (candidates.size() > 3) {
        throw new ContractException("최대 3개까지 선택 가능합니다");
    }
    
    // 우선순위 중복 체크
    Set<Integer> priorities = candidates.stream()
        .map(ContractCreateRequestDto.TrialCandidateTime::getPriority)
        .collect(Collectors.toSet());
    
    if (priorities.size() != candidates.size()) {
        throw new ContractException("우선순위가 중복되었습니다");
    }
    
    // 과거 시간 체크
    LocalDateTime now = LocalDateTime.now();
    boolean hasPastTime = candidates.stream()
        .anyMatch(c -> {
            LocalDateTime dt = LocalDateTime.of(
                c.getCandidateDate(),
                c.getCandidateStartTime()
            );
            return dt.isBefore(now);
        });
    
    if (hasPastTime) {
        throw new ContractException("과거 시간은 선택할 수 없습니다");
    }
}

private List<TrialContractCandidate> saveTrialCandidates(
    StudentTutorContract contract,
    List<ContractCreateRequestDto.TrialCandidateTime> candidateTimes
) {
    List<TrialContractCandidate> candidates = candidateTimes.stream()
        .map(c -> TrialContractCandidate.of(
            contract,
            c.getPriority(),
            c.getCandidateDate(),
            c.getCandidateStartTime()
        ))
        .collect(Collectors.toList());
    
    return trialCandidateRepository.saveAll(candidates);
}

private void checkAndUpdateCandidateAvailability(
    Long tutorProfileNo,
    List<TrialContractCandidate> candidates
) {
    for (TrialContractCandidate candidate : candidates) {
        boolean isAvailable = tutorScheduleService.checkAvailability(
            tutorProfileNo,
            candidate.getCandidateDate(),
            candidate.getCandidateStartTime()
        );
        candidate.setIsAvailable(isAvailable);
    }
    trialCandidateRepository.saveAll(candidates);
}

private void sendTrialLessonNotification(
    StudentTutorContract contract,
    List<TrialContractCandidate> candidates
) {
    long availableCount = candidates.stream()
        .filter(TrialContractCandidate::isAvailable)
        .count();
    
    String message = String.format(
        "%d개 후보 중 %d개 시간이 가능합니다",
        candidates.size(),
        availableCount
    );
    
    // NotificationService 활용
    notificationService.sendCustomNotification(
        contract.getTutorProfileNo(),
        "체험 레슨 요청",
        message,
        "/tutor/contracts/" + contract.getContractNo()
    );
}

private ContractResponseDto rejectWithAlternatives(
    StudentTutorContract contract,
    TrialRejectDto dto
) {
    log.info("대안 시간 제안과 함께 거절 - contractNo: {}, alternatives: {}", 
        contract.getContractNo(), dto.getAlternativeTimes().size());
    
    // 1. 대안 시간 검증
    validateAlternativeTimes(dto.getAlternativeTimes());
    
    // 2. Contract memo에 거절 사유 추가 (상태는 PENDING 유지)
    String updatedMemo = (contract.getMemo() != null ? contract.getMemo() + "\n" : "") +
        "[튜터 응답] " + dto.getReason();
    contract.setMemo(updatedMemo);
    contract = contractRepository.save(contract);
    
    // 3. 대안 시간들 저장
    List<TrialContractProposal> proposals = dto.getAlternativeTimes().stream()
        .map(alt -> TrialContractProposal.of(
            contract,
            alt.getProposedDate(),
            alt.getProposedStartTime()
        ))
        .collect(Collectors.toList());
    
    trialProposalRepository.saveAll(proposals);
    
    // 4. 학생에게 알림
    notificationService.sendCustomNotification(
        contract.getStudentNo(),
        "체험 레슨 대안 시간 제안",
        String.format(
            "튜터가 %d개의 대안 시간을 제안했습니다. 확인해주세요.",
            proposals.size()
        ),
        "/student/contracts/" + contract.getContractNo()
    );
    
    log.info("대안 시간 제안 완료 - contractNo: {}, proposals: {}", 
        contract.getContractNo(), proposals.size());
    
    return ContractResponseDto.from(contract);
}

private ContractResponseDto rejectWithoutAlternatives(
    StudentTutorContract contract,
    String reason
) {
    log.info("체험 레슨 단순 거절 - contractNo: {}", contract.getContractNo());
    
    // 1. Contract 상태 변경
    contract.setContractStatus(ContractStatus.CANCELLED);
    contract = contractRepository.save(contract);
    
    // 2. 학생에게 알림
    notificationService.sendContractRejected(contract, reason);
    
    log.info("체험 레슨 거절 완료 - contractNo: {}", contract.getContractNo());
    
    return ContractResponseDto.from(contract);
}

private void validateAlternativeTimes(List<TrialRejectDto.AlternativeTime> times) {
    if (times == null || times.isEmpty()) {
        throw new ContractException("대안 시간을 입력해주세요");
    }
    
    if (times.size() > 5) {
        throw new ContractException("대안 시간은 최대 5개까지 제안 가능합니다");
    }
    
    // 과거 시간 체크
    LocalDateTime now = LocalDateTime.now();
    boolean hasPastTime = times.stream()
        .anyMatch(t -> {
            LocalDateTime dt = LocalDateTime.of(
                t.getProposedDate(),
                t.getProposedStartTime()
            );
            return dt.isBefore(now);
        });
    
    if (hasPastTime) {
        throw new ContractException("과거 시간은 제안할 수 없습니다");
    }
    
    // 중복 체크
    Set<String> uniqueTimes = times.stream()
        .map(t -> t.getProposedDate() + "T" + t.getProposedStartTime())
        .collect(Collectors.toSet());
    
    if (uniqueTimes.size() != times.size()) {
        throw new ContractException("중복된 시간이 있습니다");
    }
}
```

---

## 🟢 **Phase 3: Controller 메서드 추가 (4일차)**

**파일:** `src/main/java/com/tunit/domain/contract/controller/ContractController.java` (수정)

```java
// 기존 클래스에 메서드 추가

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Slf4j
public class ContractController {
    
    private final ContractService contractService;
    
    // ========== 기존 메서드들 유지 ==========
    
    // ========== 체험 레슨 메서드들 추가 ==========
    
    /**
     * 체험 레슨 계약 생성 (학생)
     */
    @PostMapping("/trial")
    @SendNotification(
        type = NotificationType.CONTRACT_SIGNED,
        title = "새로운 체험 레슨 요청",
        message = "#{#requestDto.generateLessonName()} 요청이 도착했습니다.",
        userNoField = "#result.body.tutorProfileNo",
        deepLink = "/tutor/my/students"
    )
    public ResponseEntity<ContractResponseDto> createTrialContract(
        @LoginUser(field = "userNo") Long studentNo,
        @RequestBody ContractCreateRequestDto dto
    ) {
        log.info("체험 레슨 계약 생성 - studentNo: {}, tutorProfileNo: {}", 
            studentNo, dto.getTutorProfileNo());
        
        dto.setStudentNo(studentNo);
        dto.setSource(ContractSource.STUDENT_REQUEST);
        
        ContractResponseDto response = contractService.createTrialContract(dto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * 체험 레슨 시간 확정 (튜터)
     */
    @PostMapping("/{contractNo}/trial/confirm")
    @SendNotification(
        type = NotificationType.CONTRACT_CONFIRMED,
        title = "체험 레슨이 확정되었습니다",
        message = "#{#dto.selectedDate} #{#dto.selectedStartTime} 레슨이 확정되었습니다",
        userNoField = "#result.body.studentNo",
        deepLink = "/student/contracts"
    )
    public ResponseEntity<ContractResponseDto> confirmTrialContract(
        @PathVariable Long contractNo,
        @LoginUser(field = "tutorProfileNo") Long tutorProfileNo,
        @RequestBody TrialConfirmDto dto
    ) {
        log.info("체험 레슨 확정 - contractNo: {}, tutorProfileNo: {}", 
            contractNo, tutorProfileNo);
        
        ContractResponseDto response = contractService.confirmTrialContract(
            contractNo,
            tutorProfileNo,
            dto
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 체험 레슨 거절 (튜터)
     * - reason만 제공: 단순 거절
     * - alternativeTimes 제공: 대안 시간 제안
     */
    @PostMapping("/{contractNo}/trial/reject")
    public ResponseEntity<ContractResponseDto> rejectTrialContract(
        @PathVariable Long contractNo,
        @LoginUser(field = "tutorProfileNo") Long tutorProfileNo,
        @RequestBody TrialRejectDto dto
    ) {
        log.info("체험 레슨 거절 - contractNo: {}, hasAlternatives: {}", 
            contractNo, dto.hasAlternatives());
        
        ContractResponseDto response = contractService.rejectTrialContract(
            contractNo,
            tutorProfileNo,
            dto
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 학생이 튜터 제안 시간 수락
     */
    @PostMapping("/{contractNo}/trial/accept-proposal/{proposalId}")
    @SendNotification(
        type = NotificationType.CONTRACT_CONFIRMED,
        title = "체험 레슨이 확정되었습니다",
        message = "학생이 제안 시간을 수락했습니다",
        userNoField = "#result.body.tutorProfileNo",
        deepLink = "/tutor/contracts"
    )
    public ResponseEntity<ContractResponseDto> acceptTutorProposal(
        @PathVariable Long contractNo,
        @PathVariable Long proposalId,
        @LoginUser(field = "userNo") Long studentNo
    ) {
        log.info("튜터 제안 시간 수락 - contractNo: {}, proposalId: {}", 
            contractNo, proposalId);
        
        ContractResponseDto response = contractService.acceptTutorProposal(
            contractNo,
            studentNo,
            proposalId
        );
        
        return ResponseEntity.ok(response);
    }
}
```

---

## 🔵 **Phase 4: 테스트 (5일차)**

### 4.1 Postman 테스트 시나리오

**시나리오 1: 정상 플로우**
```
1. 학생이 체험 레슨 생성 (후보 3개)
   POST /api/contracts/trial

2. 튜터가 후보 중 하나 선택
   POST /api/contracts/{id}/trial/confirm

3. 확정 완료
```

**시나리오 2: 대안 제안 플로우**
```
1. 학생이 체험 레슨 생성 (후보 3개)
   POST /api/contracts/trial

2. 튜터가 모두 거절 + 대안 2개 제안
   POST /api/contracts/{id}/trial/reject
   {
     "reason": "해당 시간은 어렵지만...",
     "alternativeTimes": [...]
   }

3. 학생이 대안 중 하나 수락
   POST /api/contracts/{id}/trial/accept-proposal/{proposalId}

4. 확정 완료
```

**시나리오 3: 완전 거절**
```
1. 학생이 체험 레슨 생성
2. 튜터가 거절 (대안 없이)
   POST /api/contracts/{id}/trial/reject
   { "reason": "스케줄이 꽉 차있습니다" }
3. Contract CANCELLED
```

---

## 📁 **최종 파일 목록**

### 신규 생성
```
✅ entity/TrialContractCandidate.java
✅ entity/TrialContractProposal.java
✅ repository/TrialContractCandidateRepository.java
✅ repository/TrialContractProposalRepository.java
✅ dto/TrialConfirmDto.java
✅ dto/TrialRejectDto.java
✅ db/migration/V{version}__add_trial_contract_candidates.sql
```

### 수정
```
✏️ entity/StudentTutorContract.java (필드/메서드 추가)
✏️ dto/ContractCreateRequestDto.java (필드 추가)
✏️ dto/ContractResponseDto.java (필드 추가)
✏️ service/ContractService.java (메서드 추가)
✏️ controller/ContractController.java (메서드 추가)
```

---

## ✅ **Phase별 체크리스트**

### **Phase 1: DB & Entity (Day 1)**
- [ ] `trial_contract_candidates` 테이블 생성
- [ ] `trial_contract_proposals` 테이블 생성
- [ ] `student_tutor_contract` 컬럼 추가
- [ ] `TrialContractCandidate` Entity 작성
- [ ] `TrialContractProposal` Entity 작성
- [ ] `StudentTutorContract` 수정 (관계 추가)
- [ ] Repository 2개 작성
- [ ] DB 마이그레이션 실행 및 검증

### **Phase 2: DTO (Day 2)**
- [ ] `ContractCreateRequestDto` 수정 (trialCandidates 필드)
- [ ] `TrialConfirmDto` 작성
- [ ] `TrialRejectDto` 작성
- [ ] `ContractResponseDto` 수정 (체험 레슨 필드)

### **Phase 3: Service (Day 3-4)**
- [ ] `createTrialContract()` 메서드 추가
- [ ] `confirmTrialContract()` 메서드 추가
- [ ] `rejectTrialContract()` 메서드 추가
- [ ] `acceptTutorProposal()` 메서드 추가
- [ ] Private 헬퍼 메서드들 작성
- [ ] 알림 연동

### **Phase 4: Controller (Day 4)**
- [ ] `POST /api/contracts/trial` 추가
- [ ] `POST /api/contracts/{id}/trial/confirm` 추가
- [ ] `POST /api/contracts/{id}/trial/reject` 추가
- [ ] `POST /api/contracts/{id}/trial/accept-proposal/{proposalId}` 추가

### **Phase 5: 테스트 (Day 5)**
- [ ] Postman 테스트 (시나리오 1, 2, 3)
- [ ] 에러 케이스 테스트
- [ ] 알림 발송 확인
- [ ] 통합 테스트
- [ ] 버그 수정

---

## 🎯 **API 요약표**

| Method | Endpoint | Request Body | 설명 | 호출자 |
|--------|----------|--------------|------|--------|
| POST | `/api/contracts/trial` | `ContractCreateRequestDto` (trialCandidates 포함) | 체험 레슨 생성 (후보 1~3개) | 학생 |
| POST | `/api/contracts/{contractNo}/trial/confirm` | `TrialConfirmDto` | 후보 중 하나 선택하여 확정 | 튜터 |
| POST | `/api/contracts/{contractNo}/trial/reject` | `TrialRejectDto` (alternativeTimes 선택) | 거절 또는 대안 제안 | 튜터 |
| POST | `/api/contracts/{contractNo}/trial/accept-proposal/{proposalId}` | - | 튜터 제안 시간 수락 | 학생 |

---

## 📊 **데이터 플로우**

### 플로우 1: 후보 중 선택
```
학생 → 후보 3개 (🥇🥈🥉)
  ↓
[trial_contract_candidates 테이블 저장]
  ↓
튜터 → 🥇 선택
  ↓
contract.status = ACTIVE
contract.selectedCandidateDate/Time 저장
나머지 후보 삭제
```

### 플로우 2: 대안 제안 → 수락
```
학생 → 후보 3개
  ↓
튜터 → 모두 불가 + 대안 2개 제안
  ↓
[trial_contract_proposals 테이블 저장]
contract.status = PENDING 유지
  ↓
학생 → 대안 중 1개 수락
  ↓
contract.status = ACTIVE
proposal.isAccepted = true
```

---

## 🚨 **주의사항**

1. **기존 Contract 생성 로직 보존**
   - `createContract()` 메서드는 그대로 유지
   - REGULAR, FIRSTCOME 타입은 기존 방식대로

2. **NotificationService 의존성**
   - 알림 메서드가 이미 있는지 확인
   - 없으면 `sendCustomNotification()` 추가 필요

3. **TutorScheduleService 의존성**
   - `checkAvailability()` 메서드 필요
   - 튜터의 가용/불가 시간 체크 로직

4. **Kafka 연동 여부**
   - 기존에 Kafka 쓰고 있다면 체험 레슨도 Kafka로?
   - 아니면 동기 처리? (프로젝트 정책 확인 필요)

---

## 📝 **다음 단계**

이 문서를 보고 Phase 1부터 순차적으로 진행하면 됩니다!

**Last Updated:** 2026-02-23
