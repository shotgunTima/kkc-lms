package com.kkc_lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kkc_lms.dto.ComponentAssignmentDTO;
import com.kkc_lms.dto.ComponentDTO;
import com.kkc_lms.dto.OfferingDTO;
import com.kkc_lms.dto.OfferingWithAssignmentsDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Entity
@Table(name = "subject_offerings", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"subject_id","semester_id","direction_id","course"})
})
@Data
public class SubjectOffering {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subject_id")
    @JsonIgnoreProperties("teachers") // избегаем циклы
    private Subject subject;

    @ManyToOne(optional = false)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_id")
    @JsonIgnoreProperties("groups")
    private Direction direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    private Integer totalHours;
    private Integer capacity;


    @OneToMany(mappedBy = "offering", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("offering")
    private List<SubjectComponent> components = new ArrayList<>();
    public OfferingDTO toDto() {
        OfferingDTO dto = new OfferingDTO();
        dto.setId(this.getId());

        // Subject info
        dto.setSubjectId(this.getSubject().getId());
        dto.setSubjectCode(this.getSubject().getCode());
        dto.setSubjectName(this.getSubject().getName());
        dto.setCredits(this.getSubject().getCredits());

        // Semester info
        dto.setSemesterId(this.getSemester().getId());
        dto.setSemesterName(this.getSemester().getName());

        // Direction info
        dto.setDirectionId(this.getDirection().getId());
        dto.setDirectionName(this.getDirection().getName());

        // Course, hours, capacity
        dto.setCourse(this.getCourse().name());
        dto.setTotalHours(this.getTotalHours());
        dto.setCapacity(this.getCapacity());

        // Components
        if (this.getComponents() != null) {
            dto.setComponents(this.getComponents().stream().map(c -> {
                ComponentDTO cd = new ComponentDTO();
                cd.setId(c.getId());
                cd.setType(c.getType());
                cd.setHours(c.getHours());

                // Собираем всех преподавателей из assignments
                String teacherNames = c.getAssignments().stream()
                        .map(a -> a.getTeacher().getUser().getFullname())
                        .distinct()
                        .reduce((a, b) -> a + ", " + b)
                        .orElse(null);
                cd.setTeacherName(teacherNames);

                return cd;
            }).toList());
        }

        return dto;
    }



    public OfferingWithAssignmentsDTO toWithAssignmentsDto() {
        OfferingWithAssignmentsDTO dto = new OfferingWithAssignmentsDTO();
        dto.setId(this.id);
        dto.setSubjectCode(this.subject.getCode());
        dto.setSubjectName(this.subject.getName());
        dto.setCredits(this.subject.getCredits());
        dto.setTotalHours(this.totalHours);
        dto.setCapacity(this.capacity);
        dto.setSubjectId(this.getSubject().getId());
        dto.setSemesterId(this.getSemester().getId());
        dto.setDirectionId(this.getDirection().getId());
        dto.setCourse(this.course != null ? this.course.name() : null);
        dto.setSemesterName(this.getSemester().getName());
        dto.setDirectionName(this.getDirection().getName());



        List<ComponentAssignmentDTO> assignments = this.components.stream()
                .flatMap(c -> {
                    if (c.getAssignments().isEmpty()) {
                        // даже если нет teacherId/groupId, возвращаем "пустой" assignment
                        ComponentAssignmentDTO cadto = new ComponentAssignmentDTO();
                        cadto.setComponentId(c.getId());
                        cadto.setType(c.getType());
                        cadto.setHours(c.getHours());
                        cadto.setTeacherId(null);
                        cadto.setTeacherName(null);
                        cadto.setGroupId(null);
                        cadto.setGroupName(null);
                        return Stream.of(cadto);
                    } else {
                        return c.getAssignments().stream().map(a -> {
                            ComponentAssignmentDTO cadto = new ComponentAssignmentDTO();
                            cadto.setComponentId(c.getId());
                            cadto.setType(c.getType());
                            cadto.setHours(c.getHours());
                            cadto.setTeacherId(a.getTeacher().getId());
                            cadto.setTeacherName(a.getTeacher().getUser().getFullname());
                            cadto.setGroupId(a.getGroup().getId());
                            cadto.setGroupName(a.getGroup().getName());
                            return cadto;
                        });
                    }
                })
                .toList();

        dto.setComponentAssignments(assignments);
        return dto;
    }



}
