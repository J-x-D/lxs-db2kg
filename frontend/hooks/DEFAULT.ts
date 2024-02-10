import { Graph } from '../types/RmlRulesTypes';

export const defaultRmlRules: Graph[] = [
    {
        "@id": "http://example.com/course",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "'+logicalSource+'",
            "rr:query": "SELECT*FROMcourse"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/course/{id}",
            "rr:class": "http://example.com/course"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/course_name",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "course_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/professor_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "professor_id"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/study_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "study_id"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/weekday_of_course",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "weekday_of_course"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/start_time",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "start_time"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/end_time",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:column": "end_time"
                }
            }
        ]
    },
    {
        "@id": "http://example.com/triplesMap1",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource1",
            "@type": "rr:LogicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap1",
            "@type": "rr:SubjectMap",
            "rr:template": "http://example.com/student/{id}",
            "rr:class": "http://example.com/Student"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/firstName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "@type": "rr:ObjectMap",
                    "rr:column": "first_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/lastName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "@type": "rr:ObjectMap",
                    "rr:column": "last_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap3",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/birthdate",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap3",
                    "@type": "rr:ObjectMap",
                    "rr:column": "birthdate"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap4",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/matriculationNumber",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap4",
                    "@type": "rr:ObjectMap",
                    "rr:column": "matriculation_number"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap5",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/course",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap5",
                    "@type": "rr:ObjectMap",
                    "rr:parentTriplesMap": "http://example.com/triplesMap2",
                    "rr:joinCondition": {
                        "@id": "http://example.com/joinCondition1",
                        "@type": "rr:JoinCondition",
                        "rr:child": "id",
                        "rr:parent": "student_id"
                    }
                }
            }
        ]
    },
    {
        "@id": "http://example.com/professor",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/professor/{id}",
            "rr:class": "http://example.com/Professor"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "rr:predicate": "http://example.com/firstName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "rr:column": "first_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "rr:predicate": "http://example.com/lastName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "rr:column": "last_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap3",
                "rr:predicate": "http://example.com/birthdate",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap3",
                    "rr:column": "birthdate"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap4",
                "rr:predicate": "http://example.com/fieldOfSubject",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap4",
                    "rr:column": "field_of_subject"
                }
            }
        ]
    },
    {
        "@id": "http://example.com/triplesMap1",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource1",
            "@type": "rr:LogicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap1",
            "@type": "rr:SubjectMap",
            "rr:template": "http://example.com/study/{id}",
            "rr:class": "http://example.com/Study"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/studyName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "@type": "rr:ObjectMap",
                    "rr:column": "study_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/regulation",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "@type": "rr:ObjectMap",
                    "rr:column": "regulation"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap3",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/responsibleProfessor",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap3",
                    "@type": "rr:ObjectMap",
                    "rr:parentTriplesMap": "http://example.com/triplesMap2",
                    "rr:joinCondition": {
                        "@id": "http://example.com/joinCondition1",
                        "@type": "rr:JoinCondition",
                        "rr:child": "id",
                        "rr:parent": "responsible_professor_id"
                    }
                }
            }
        ]
    },
    {
        "@id": "http://example.com/faculty",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:query": "SELECT*FROMfaculty"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/faculty/{id}",
            "rr:class": "http://example.com/Faculty"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "rr:predicate": "http://example.com/facultyName",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "rr:column": "faculty_name"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "rr:predicate": "http://example.com/regulation",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "rr:column": "regulation"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap3",
                "rr:predicate": "http://example.com/dean",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap3",
                    "rr:parentTriplesMap": "http://example.com/professor",
                    "rr:joinCondition": {
                        "@id": "http://example.com/joinCondition",
                        "rr:child": "http://example.com/professor/id",
                        "rr:parent": "http://example.com/faculty/dean_id"
                    }
                }
            }
        ]
    },
    {
        "@id": "http://example.com/triplesMap1",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource1",
            "@type": "rr:LogicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap1",
            "@type": "rr:SubjectMap",
            "rr:template": "http://example.com/student_course/{id}",
            "rr:class": "http://example.com/student_course"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/student_course/student_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "@type": "rr:ObjectMap",
                    "rr:parentTriplesMap": "http://example.com/triplesMap2",
                    "rr:joinCondition": {
                        "@id": "http://example.com/joinCondition1",
                        "@type": "rr:JoinCondition",
                        "rr:child": "id",
                        "rr:parent": "student_id"
                    }
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "@type": "rr:PredicateObjectMap",
                "rr:predicate": "http://example.com/student_course/course_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "@type": "rr:ObjectMap",
                    "rr:parentTriplesMap": "http://example.com/triplesMap3",
                    "rr:joinCondition": {
                        "@id": "http://example.com/joinCondition2",
                        "@type": "rr:JoinCondition",
                        "rr:child": "id",
                        "rr:parent": "course_id"
                    }
                }
            }
        ]
    },
    {
        "@id": "http://example.com/professor_course",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/professor_course/{id}",
            "rr:class": "http://example.com/professor_course"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/professor_course/professor_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:template": "http://example.com/professor/{professor_id}",
                    "rr:class": "http://example.com/professor"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap",
                "rr:predicate": "http://example.com/professor_course/course_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap",
                    "rr:template": "http://example.com/course/{course_id}",
                    "rr:class": "http://example.com/course"
                }
            }
        ]
    },
    {
        "@id": "http://example.com/faculty_student",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/faculty_student/{id}",
            "rr:class": "http://example.com/faculty_student"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "rr:predicate": "http://example.com/faculty_student/faculty_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "rr:template": "http://example.com/faculty/{faculty_id}",
                    "rr:class": "http://example.com/faculty"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "rr:predicate": "http://example.com/faculty_student/student_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "rr:template": "http://example.com/student/{student_id}",
                    "rr:class": "http://example.com/student"
                }
            }
        ]
    },
    {
        "@id": "http://example.com/faculty_professor",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/faculty_professor/{id}",
            "rr:class": "http://example.com/faculty_professor"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "rr:predicate": "http://example.com/faculty_professor/faculty_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "rr:template": "http://example.com/faculty/{faculty_id}",
                    "rr:class": "http://example.com/faculty"
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "rr:predicate": "http://example.com/faculty_professor/professor_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "rr:template": "http://example.com/professor/{professor_id}",
                    "rr:class": "http://example.com/professor"
                }
            }
        ]
    },
    {
        "@id": "http://example.com/faculty_study",
        "@type": "rr:TriplesMap",
        "rr:logicalSource": {
            "@id": "http://example.com/logicalSource",
            "rr:source": "postgres://sa:YourStrong!Passw0rd@localhost:5432/db",
            "rr:referenceFormulation": "QOM"
        },
        "rr:subjectMap": {
            "@id": "http://example.com/subjectMap",
            "rr:template": "http://example.com/faculty_study/{id}",
            "rr:class": "http://example.com/faculty_study"
        },
        "rr:predicateObjectMap": [
            {
                "@id": "http://example.com/predicateObjectMap1",
                "rr:predicate": "http://example.com/faculty_study/faculty_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap1",
                    "rr:parentTriplesMap": "http://example.com/faculty",
                    "rr:joinCondition": {
                        "rr:child": "faculty_id",
                        "rr:parent": "id"
                    }
                }
            },
            {
                "@id": "http://example.com/predicateObjectMap2",
                "rr:predicate": "http://example.com/faculty_study/study_id",
                "rr:objectMap": {
                    "@id": "http://example.com/objectMap2",
                    "rr:parentTriplesMap": "http://example.com/study",
                    "rr:joinCondition": {
                        "rr:child": "study_id",
                        "rr:parent": "id"
                    }
                }
            }
        ]
    }
]