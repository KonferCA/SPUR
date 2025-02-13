import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Button, DropdownOption, UploadableFile } from '@components';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
    getProjectFormQuestions,
    ProjectDraft,
    saveProjectDraft,
    submitProject,
} from '@/services/project';
import {
    GroupedProjectQuestions,
    groupProjectQuestions,
    Question,
} from '@/config/forms';
import { SectionedLayout } from '@/templates';
import { cva } from 'class-variance-authority';
import { sanitizeHtmlId } from '@/utils/html';
import { QuestionInputs } from '@/components/QuestionInputs/QuestionInputs';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { scrollToTop } from '@/utils';
import { useDebounceFn } from '@/hooks';
import { useAuth, useNotification } from '@/contexts';
import { getSampleAnswer } from '@/utils/sampleData';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/user/_auth/project/$projectId/form')({
    component: ProjectFormPage,
});

const stepItemStyles = cva(
    'relative transition text-gray-400 hover:text-gray-600 hover:cursor-pointer py-2',
    {
        variants: {
            active: {
                true: ['text-gray-700 hover:text-gray-700'],
            },
        },
    }
);

const questionGroupContainerStyles = cva('');
const questionGroupTitleStyles = cva('font-bold align-left text-xl');
const questionGroupTitleSeparatorStyles = cva(
    'my-4 bg-gray-400 w-full h-[2px]'
);
const questionGroupQuestionsContainerStyles = cva('space-y-6');

function ProjectFormPage() {
    const { projectId: currentProjectId } = Route.useParams();
    const navigate = useNavigate({
        from: `/user/project/${currentProjectId}/form`,
    });
    const { accessToken, companyId } = useAuth();
    const { data: questionData, isLoading: loadingQuestions } = useQuery({
        //@ts-ignore generic type inference error here (tanstack problem)
        queryKey: ['projectFormQuestions', accessToken, currentProjectId],
        queryFn: async () => {
            if (!accessToken || !currentProjectId) return;
            const data = await getProjectFormQuestions(
                accessToken,
                currentProjectId
            );
            return data;
        },
        enabled: !!currentProjectId,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
    const [groupedQuestions, setGroupedQuestions] = useState<
        GroupedProjectQuestions[]
    >([]);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const dirtyInputRef = useRef<Map<string, ProjectDraft>>(new Map());
    const notification = useNotification();
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const autosave = useDebounceFn(
        async () => {
            if (!currentProjectId || !accessToken || !companyId) return;

            // Find all dirty inputs and create params while clearing dirty flags
            const dirtyInputsSnapshot: ProjectDraft[] = Array.from(
                dirtyInputRef.current.values()
            );
            dirtyInputRef.current.clear();

            let notificationId = '';
            try {
                if (dirtyInputsSnapshot.length > 0) {
                    notificationId = notification.push({
                        message: 'Saving answers...',
                        level: 'info',
                        autoClose: false,
                    });
                    await saveProjectDraft(
                        accessToken,
                        currentProjectId,
                        dirtyInputsSnapshot
                    );
                    setTimeout(() => {
                        notification.update(notificationId, {
                            message: 'Answers saved!',
                            level: 'success',
                            autoClose: true,
                            duration: 1000,
                        });
                    }, 1000);
                }
            } catch (e) {
                console.error(e);
                if (notificationId) {
                    notification.update(notificationId, {
                        message: 'Failed to save answers',
                        level: 'error',
                        autoClose: true,
                        duration: 3000,
                    });
                }
            }
        },
        1500,
        [currentProjectId, accessToken, companyId]
    );

    const handleChange = (
        questionId: string,
        inputFieldKey: string,
        value: any
    ) => {
        console.log('[ProjectPage] handleChange called:', {
            questionId,
            inputFieldKey,
            valueType: typeof value,
            isArray: Array.isArray(value),
            value,
        });

        setGroupedQuestions((prevGroups) => {
            const newGroups = prevGroups.map((group, idx) => {
                // ONLY process the current step
                if (currentStep !== idx) return group;

                return {
                    ...group,
                    subSections: group.subSections.map((subsection) => ({
                        ...subsection,
                        questions: subsection.questions.map((question) => {
                            // Process file uploads separately from other field types
                            const isFileInput = question.inputFields.some(
                                (f) =>
                                    f.type === 'file' && f.key === inputFieldKey
                            );

                            if (isFileInput) {
                                // Handle file upload case
                                return {
                                    ...question,
                                    inputFields: question.inputFields.map(
                                        (field) => {
                                            if (field.key !== inputFieldKey)
                                                return field;

                                            const files =
                                                value as UploadableFile[];

                                            // If we're clearing files
                                            if (files.length === 0) {
                                                return {
                                                    ...field,
                                                    value: {
                                                        ...field.value,
                                                        value: [],
                                                    },
                                                };
                                            }

                                            // Handle file upload state
                                            const uploadedFiles = files.filter(
                                                (f) => f.metadata?.id
                                            );
                                            if (uploadedFiles.length > 0) {
                                                dirtyInputRef.current.set(
                                                    inputFieldKey,
                                                    {
                                                        question_id:
                                                            inputFieldKey,
                                                        answer:
                                                            uploadedFiles[0]
                                                                .metadata?.id ||
                                                            '',
                                                    }
                                                );
                                                setTimeout(() => autosave(), 0);
                                            }

                                            return {
                                                ...field,
                                                value: {
                                                    ...field.value,
                                                    value: files,
                                                },
                                            };
                                        }
                                    ),
                                };
                            }

                            // Handle non-file fields
                            if (question.id !== questionId) return question;

                            return {
                                ...question,
                                inputFields: question.inputFields.map(
                                    (field) => {
                                        if (field.key !== inputFieldKey)
                                            return field;

                                        let newValue = value;
                                        switch (field.type) {
                                            case 'select':
                                            case 'multiselect':
                                                const choices =
                                                    value as DropdownOption[];
                                                dirtyInputRef.current.set(
                                                    questionId,
                                                    {
                                                        question_id: questionId,
                                                        answer: choices.map(
                                                            (c) => c.value
                                                        ),
                                                    }
                                                );
                                                break;

                                            case 'date':
                                                const date = value as Date;
                                                dirtyInputRef.current.set(
                                                    questionId,
                                                    {
                                                        question_id: questionId,
                                                        answer: date
                                                            .toISOString()
                                                            .split('T')[0],
                                                    }
                                                );
                                                break;

                                            default:
                                                dirtyInputRef.current.set(
                                                    questionId,
                                                    {
                                                        question_id: questionId,
                                                        answer: value,
                                                    }
                                                );
                                                break;
                                        }

                                        setTimeout(() => autosave(), 0);
                                        return {
                                            ...field,
                                            value: {
                                                ...field.value,
                                                value: newValue,
                                            },
                                        };
                                    }
                                ),
                            };
                        }),
                    })),
                };
            });

            return newGroups;
        });
    };

    const handleNextStep = () => {
        setCurrentStep((curr) => {
            if (curr < groupedQuestions.length - 1) return curr + 1;
            return curr;
        });
        setTimeout(() => {
            scrollToTop();
        }, 120);
    };

    const handleBackStep = () => {
        setCurrentStep((curr) => {
            if (curr > 0) return curr - 1;
            return curr;
        });
        setTimeout(() => {
            scrollToTop();
        }, 120);
    };

    const handleFillSampleData = () => {
        const newGroups = groupedQuestions.map((group) => ({
            ...group,
            subSections: group.subSections.map((subsection) => ({
                ...subsection,
                questions: subsection.questions.map((question) => ({
                    ...question,
                    inputFields: question.inputFields.map((field) => {
                        if (field.disabled) {
                            return field;
                        }

                        const key = `${question.id}_${field.key}`;

                        // Skip file and team input types
                        if (field.type === 'file' || field.type === 'team') {
                            return field;
                        }

                        const sampleValue = getSampleAnswer(
                            question.question,
                            field.type
                        );

                        // Add to dirty inputs for saving
                        dirtyInputRef.current.set(key, {
                            question_id: question.id,
                            answer: sampleValue,
                        });

                        return {
                            ...field,
                            value: {
                                ...field.value,
                                value: sampleValue,
                            },
                        };
                    }),
                })),
            })),
        }));

        setGroupedQuestions(newGroups);
        autosave();
    };

    useEffect(() => {
        if (questionData) {
            setGroupedQuestions(groupProjectQuestions(questionData));
        }
    }, [questionData]);

    const asideLinks = groupedQuestions[currentStep]?.subSectionNames.map(
        (name) => ({
            target: `#${sanitizeHtmlId(name)}`,
            label: name,
        })
    );

    const shouldRenderQuestion = (
        question: Question,
        allQuestions: Question[]
    ) => {
        if (!question.dependentQuestionId) return true;

        const dependentQuestion = allQuestions.find(
            (q) => q.id === question.dependentQuestionId
        );
        if (!dependentQuestion) return true;

        // Find the answer in the grouped questions
        let dependentAnswer: string | DropdownOption[] = '';
        for (const group of groupedQuestions) {
            for (const subSection of group.subSections) {
                const foundQuestion = subSection.questions.find(
                    (q) => q.id === question.dependentQuestionId
                );
                if (
                    foundQuestion &&
                    foundQuestion.inputFields[0]?.value.value
                ) {
                    dependentAnswer = foundQuestion.inputFields[0].value.value;
                    break;
                }
            }
        }

        if (Array.isArray(dependentAnswer)) {
            switch (question.conditionType?.conditionTypeEnum) {
                case 'empty':
                    return dependentAnswer.length === 0;
                case 'not_empty':
                    return dependentAnswer.length > 0;
                case 'equals':
                    return dependentAnswer.every(
                        (a) => a.value === question.conditionValue
                    );
                case 'contains':
                    return (
                        dependentAnswer.findIndex(
                            (a) => a.value === question.conditionValue
                        ) !== -1
                    );
                default:
                    return true;
            }
        } else {
            switch (question.conditionType?.conditionTypeEnum) {
                case 'empty':
                    return !dependentAnswer;
                case 'not_empty':
                    return !!dependentAnswer;
                case 'equals':
                    return dependentAnswer === question.conditionValue;
                case 'contains':
                    return dependentAnswer.includes(
                        question.conditionValue || ''
                    );
                default:
                    return true;
            }
        }
    };

    const handleSubmit = async () => {
        // validate all the questions
        const valid = groupedQuestions.every((group) => {
            return group.subSections.every((subsection) => {
                return subsection.questions.every((question) => {
                    // if question is dependent on previous and it should be rendered
                    // then we check the answer of this input
                    if (
                        question.conditionType &&
                        question.conditionType.valid &&
                        !shouldRenderQuestion(question, subsection.questions)
                    ) {
                        return true;
                    }

                    return question.inputFields.every((input) => {
                        let valid = true;

                        // reset invalid state
                        input.invalid = false;

                        if (!input.required && !input.value.value) return true;

                        switch (input.type) {
                            case 'date':
                            case 'textarea':
                            case 'textinput':
                                if (!input.value.value) {
                                    valid = false;
                                } else if (input.validations) {
                                    valid = input.validations.every(
                                        (validation) =>
                                            validation.safeParse(
                                                input.value.value
                                            ).success
                                    );
                                }
                                break;
                            case 'select':
                            case 'multiselect':
                                if (
                                    !Array.isArray(input.value.value) ||
                                    !input.value.value.length
                                ) {
                                    return false;
                                } else if (input.validations) {
                                    const values = input.value
                                        .value as string[];
                                    valid = values.every((v) =>
                                        input.validations?.every(
                                            (validation) =>
                                                validation.safeParse(v).success
                                        )
                                    );
                                }
                                break;

                            default:
                                break;
                        }

                        input.invalid = !valid;

                        return valid;
                    });
                });
            });
        });

        if (valid) {
            // try {
            //     if (!accessToken || !currentProjectId) return;
            //     await submitProject(accessToken, currentProjectId);
            //     // replace to not let them go back, it causes the creation of a new project
            //     navigate({ to: '/user/dashboard', replace: true });
            // } catch (e) {
            //     console.error(e);
            // }
            setShowSubmitModal(true);
        } else {
            // update the group questions so that it refreshes the ui
            setGroupedQuestions((prev) => [...prev]);
        }
    };

    const handleSubmitConfirm = async () => {
        try {
            if (!accessToken || !currentProjectId) return;
            await submitProject(accessToken, currentProjectId);

            // replace to not let them go back, it causes the creation of a new project
            navigate({ to: '/user/dashboard', replace: true });
        } catch (e) {
            console.error(e);
        }
    }

    // TODO: make a better loading screen
    if (groupedQuestions.length < 1 || loadingQuestions) return null;

    return (
        <div>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-24 border-b border-gray-300">
                <ul className="flex items-center pl-4 h-full">
                    <li>
                        <Link
                            to="/user/dashboard"
                            className="transition p-2 inline-block rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <span>
                                    <IoMdArrowRoundBack />
                                </span>
                                <span>Back to dashboard</span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="h-24"></div>
            <SectionedLayout
                asideTitle={groupedQuestions[currentStep]?.section ?? ''}
                linkContainerClassnames="top-36"
                links={asideLinks}
            >
                <div>
                    <div>
                        <nav>
                            <ul className="flex gap-4 items-center justify-center">
                                {groupedQuestions.map((group, idx) => (
                                    <li
                                        key={`step_${group.section}`}
                                        className={stepItemStyles({
                                            active: currentStep === idx,
                                        })}
                                        onClick={() => {
                                            setCurrentStep(idx);
                                        }}
                                    >
                                        <span>{group.section}</span>
                                        {currentStep === idx ? (
                                            <div className="absolute bottom-0 h-[2px] bg-gray-700 w-full"></div>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="flex justify-end px-4 py-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleFillSampleData}
                        >
                            Fill with Sample Data
                        </Button>
                    </div>
                    <form className="space-y-12 lg:max-w-3xl mx-auto mt-12">
                        {groupedQuestions[currentStep].subSections.map(
                            (subsection) => (
                                <div
                                    id={sanitizeHtmlId(subsection.name)}
                                    key={subsection.name}
                                    className={questionGroupContainerStyles()}
                                >
                                    <div>
                                        <h1
                                            className={questionGroupTitleStyles()}
                                        >
                                            {subsection.name}
                                        </h1>
                                    </div>
                                    <div
                                        className={questionGroupTitleSeparatorStyles()}
                                    ></div>
                                    <div
                                        className={questionGroupQuestionsContainerStyles()}
                                    >
                                        {subsection.questions.map((q) =>
                                            shouldRenderQuestion(
                                                q,
                                                subsection.questions
                                            ) ? (
                                                <QuestionInputs
                                                    key={q.id}
                                                    question={q}
                                                    onChange={handleChange}
                                                    fileUploadProps={
                                                        accessToken
                                                            ? {
                                                                  projectId:
                                                                      currentProjectId,
                                                                  questionId:
                                                                      q.id,
                                                                  section:
                                                                      groupedQuestions[
                                                                          currentStep
                                                                      ].section,
                                                                  subSection:
                                                                      subsection.name,
                                                                  accessToken:
                                                                      accessToken,
                                                                  enableAutosave:
                                                                      true,
                                                              }
                                                            : undefined
                                                    }
                                                />
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                        <div className="pb-32 flex gap-8">
                            <Button
                                variant="outline"
                                liquid
                                type="button"
                                disabled={currentStep === 0}
                                onClick={handleBackStep}
                            >
                                Back
                            </Button>
                            <Button
                                liquid
                                type="button"
                                onClick={
                                    currentStep < groupedQuestions.length - 1
                                        ? handleNextStep
                                        : handleSubmit
                                }
                            >
                                {currentStep < groupedQuestions.length - 1
                                    ? 'Continue'
                                    : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </div>
            </SectionedLayout>

            <ConfirmationModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                primaryAction={handleSubmitConfirm}
                title="Submit Application?"
                primaryActionText="Yes, submit it"
            >
                <div className="space-y-4">
                    <p>Have you double-checked everything in this project?</p>
                    <p>
                        Once submitted, you won't be able to make changes until the application
                        is either approved or sent back for review.
                    </p>
                </div>
            </ConfirmationModal>
        </div>
    );
}
