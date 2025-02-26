import React, { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import {
    Button,
    FileUpload,
    TextArea,
    TextInput,
    UploadableFile,
} from '@components';
import type { TeamMember } from '@/types';
import {
    addTeamMember,
    deleteTeamMember,
    uploadTeamMemberDocument,
} from '@/services/teams';
import { useAuth, useNotification } from '@/contexts';
import { getUserProfile } from '@/services/user';

export interface TeamMembersProps {
    initialValue: TeamMember[];
    disabled?: boolean;
}

interface LocalTeamMember extends TeamMember {
    isLoading: boolean;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({
    initialValue = [],
    disabled = false,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newMember, setNewMember] = useState<Partial<LocalTeamMember>>({});
    const [members, setMembers] = useState<LocalTeamMember[]>([]);
    const [resumeFile, setResumeFile] = useState<UploadableFile | null>(null);
    const [foundersAgreementFile, setFoundersAgreementFile] = useState<UploadableFile | null>(null);

    const { accessToken, companyId, user } = useAuth();
    const notification = useNotification();

    useEffect(() => {
        const initializeMembers = async () => {
            if (user && accessToken) {
                try {
                    const userProfile = await getUserProfile(accessToken, user.id);
                    
                    const accountOwner: LocalTeamMember = {
                        id: user.id,
                        firstName: user.firstName || user.email.split('@')[0],
                        lastName: user.lastName || '',
                        title: userProfile.title || 'Account Owner',
                        detailedBiography: userProfile.bio || '',
                        linkedin: userProfile.linkedin_url || '',
                        resumeExternalUrl: '',
                        resumeInternalUrl: '',
                        personalWebsite: '',
                        introduction: '',
                        commitmentType: 'Full-time',
                        industryExperience: '',
                        previousWork: '',
                        founderAgreementExternalUrl: '',
                        founderAgreementInternalUrl: '',
                        isAccountOwner: true,
                        isLoading: false,
                        created_at: Date.now(),
                    };

                    const otherMembers = initialValue
                        .filter(member => !member.isAccountOwner)
                        .map(member => ({ ...member, isLoading: false }));

                    setMembers([accountOwner, ...otherMembers]);
                } catch (error) {
                    notification.push({
                        message: 'Failed to fetch owner profile',
                        level: 'error',
                        autoClose: true,
                        duration: 2000,
                    });

                    // still add the account owner even if profile fetch fails, but with minimal info
                    const accountOwner: LocalTeamMember = {
                        id: user.id,
                        firstName: user.firstName || user.email.split('@')[0],
                        lastName: user.lastName || '',
                        title: 'Account Owner',
                        detailedBiography: '',
                        linkedin: '',
                        resumeExternalUrl: '',
                        resumeInternalUrl: '',
                        personalWebsite: '',
                        introduction: '',
                        commitmentType: 'Full-time',
                        industryExperience: '',
                        previousWork: '',
                        founderAgreementExternalUrl: '',
                        founderAgreementInternalUrl: '',
                        isAccountOwner: true,
                        isLoading: false,
                        created_at: Date.now(),
                    };

                    setMembers([accountOwner, ...initialValue.map(member => ({ ...member, isLoading: false }))]);
                }
            }
        };

        initializeMembers();
    }, [user, accessToken, initialValue]);

    const checkAllRequired = () => {
        return (
            newMember.firstName &&
            newMember.lastName &&
            newMember.title &&
            newMember.linkedin &&
            (resumeFile !== null || newMember.resumeExternalUrl) &&
            newMember.personalWebsite &&
            newMember.commitmentType &&
            newMember.introduction &&
            newMember.industryExperience &&
            newMember.detailedBiography
        );
    };

    const saveToDatabase = async (member: LocalTeamMember) => {
        if (!accessToken || !companyId) {
            // remove member from the list
            setMembers((prev) => prev.filter((m) => m.id != member.id));
            return;
        }

        const notificationId = notification.push({
            message: 'Saving team member...',
            level: 'info',
            autoClose: false,
        });
        try {
            const res = await addTeamMember(accessToken, {
                companyId,
                member,
            });
            const originalId = member.id;

            // upload files
            if (resumeFile) {
                await uploadTeamMemberDocument(accessToken, {
                    memberId: res.id,
                    docType: 'resume',
                    companyId,
                    file: resumeFile,
                });
            }

            if (foundersAgreementFile) {
                await uploadTeamMemberDocument(accessToken, {
                    memberId: res.id,
                    docType: 'founders_agreement',
                    companyId,
                    file: foundersAgreementFile,
                });
            }

            // Update the member id to the response id
            // the response has the permament id generated by the backend
            Object.assign(member, {
                id: res.id,
                isLoading: false,
            });

            setTimeout(() => {
                notification.update(notificationId, {
                    message: 'Team member saved',
                    level: 'success',
                    autoClose: true,
                    duration: 1000,
                });
            }, 1000);

            setMembers((prev) =>
                prev.map((m) => (m.id === originalId ? { ...member } : m))
            );
        } catch (e) {
            console.error(e);
            // remove member from the list
            setMembers((prev) => prev.filter((m) => m.id != member.id));
            notification.update(notificationId, {
                message: 'Failed to save team member',
                level: 'error',
                autoClose: true,
                duration: 2000,
            });
        }
    };

    const handleAdd = () => {
        if (checkAllRequired()) {
            const member: LocalTeamMember = {
                id: Math.random().toString(36).substring(2, 9),
                firstName: newMember.firstName!,
                lastName: newMember.lastName!,
                title: newMember.title!,
                detailedBiography: newMember.detailedBiography!,
                linkedin: newMember.linkedin!,
                resumeExternalUrl: newMember.resumeExternalUrl || '',
                resumeInternalUrl: newMember.resumeInternalUrl || '',
                personalWebsite: newMember.personalWebsite!,
                introduction: newMember.introduction!,
                commitmentType: newMember.commitmentType!,
                industryExperience: newMember.industryExperience!,
                previousWork: newMember.previousWork || '',
                founderAgreementExternalUrl:
                    newMember.founderAgreementExternalUrl || '',
                founderAgreementInternalUrl:
                    newMember.founderAgreementInternalUrl || '',
                isAccountOwner: false,
                isLoading: true,
                created_at: Date.now(),
            };

            saveToDatabase(member);
            // optimistic addition
            setMembers([...members, member]);
            setNewMember({});
            setIsAdding(false);
        }
    };

    const removeFromDatabase = async (member: LocalTeamMember) => {
        if (!accessToken || !companyId) {
            // add the member that was removed
            setMembers((prev) => [...prev, member]);
            return;
        }
        const notificationId = notification.push({
            message: 'Removing team member...',
            level: 'info',
            autoClose: false,
        });
        try {
            await deleteTeamMember(accessToken, { companyId, member });
            setTimeout(() => {
                notification.update(notificationId, {
                    message: 'Team member removed',
                    level: 'success',
                    autoClose: true,
                    duration: 1000,
                });
            }, 1000);
        } catch (e) {
            console.error(e);
            // add the member that was removed
            setMembers((prev) => [...prev, member]);
            notification.update(notificationId, {
                message: 'Failed to remove team member',
                level: 'error',
                autoClose: true,
                duration: 2000,
            });
        }
    };

    const handleRemove = (member: LocalTeamMember) => {
        if (member.isAccountOwner) return;

        // optimistic removal
        setMembers((prev) => prev.filter((m) => m.id != member.id));
        removeFromDatabase(member);
    };

    return (
        <div className="space-y-4">
            {/* Member List */}
            <div className="grid grid-cols-2 gap-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                            {[member.firstName[0], member.lastName[0]].join('')}
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                            <div className="font-medium truncate">
                                {[member.firstName, member.lastName].join(' ')}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                                {member.title}
                                {member.isAccountOwner && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        Account Owner
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {!member.isLoading && !disabled && !member.isAccountOwner && (
                                <button
                                    onClick={() => handleRemove(member)}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                >
                                    <FiX size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Member Form */}
            {!disabled &&
                (isAdding ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4 border-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <TextInput
                                    label="First Name"
                                    value={newMember.firstName || ''}
                                    onChange={(e) =>
                                        setNewMember((prev) => ({
                                            ...prev,
                                            firstName: e.target.value,
                                        }))
                                    }
                                    required
                                />
                                <TextInput
                                    label="Last Name"
                                    value={newMember.lastName || ''}
                                    onChange={(e) =>
                                        setNewMember((prev) => ({
                                            ...prev,
                                            lastName: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                            <TextInput
                                label="Position/Title"
                                value={newMember.title || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextInput
                                label="LinkedIn Profile"
                                value={newMember.linkedin || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        linkedin: e.target.value,
                                    }))
                                }
                                required
                            />
                            <fieldset>
                                <div className="flex justify-between items-center mb-1">
                                    <legend className="block text-md font-normal">
                                        Resume or CV
                                    </legend>
                                    <span className="text-sm text-gray-500">
                                        Required
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <TextInput
                                        value={
                                            newMember.resumeExternalUrl || ''
                                        }
                                        onChange={(e) =>
                                            setNewMember((prev) => ({
                                                ...prev,
                                                resumeExternalUrl:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Provide a link or upload directly"
                                        required
                                    />
                                    <FileUpload
                                        limit={1}
                                        onFilesChange={(files) => {
                                            if (files.length) {
                                                setResumeFile(files[0]);
                                            } else {
                                                setResumeFile(null);
                                            }
                                        }}
                                    />
                                    {resumeFile && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium">
                                                    {resumeFile.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setResumeFile(null)
                                                }
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                            <TextInput
                                label="Personal website or portfolio URL"
                                value={newMember.personalWebsite || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        personalWebsite: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextInput
                                label="How committed is this person (e.g., full-time, personal investment)?"
                                value={newMember.commitmentType || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        commitmentType: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextInput
                                label="Give a brief introduction as to who this person is and what their background and expertise are."
                                value={newMember.introduction || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        introduction: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextArea
                                label="Does this person have relevant experience in the industry?"
                                value={newMember.industryExperience || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        industryExperience: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextArea
                                label="Give a detailed biography of this person, outlining roles, responsibilities, and key achievements."
                                value={newMember.detailedBiography || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        detailedBiography: e.target.value,
                                    }))
                                }
                                required
                            />
                            <TextInput
                                label="Are there any examples of previous work or case studies from past ventures that this person has participated in?"
                                value={newMember.previousWork || ''}
                                onChange={(e) =>
                                    setNewMember((prev) => ({
                                        ...prev,
                                        previousWork: e.target.value,
                                    }))
                                }
                            />
                            <fieldset>
                                <div className="flex justify-between items-center mb-1">
                                    <legend className="block text-md font-normal">
                                        Is there a founder's agreement in place
                                        that outlines roles, responsibilities,
                                        equity split, and dispute resolution
                                        mechanisms?
                                    </legend>
                                </div>
                                <div className="space-y-4">
                                    <TextInput
                                        value={
                                            newMember.founderAgreementExternalUrl ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            setNewMember((prev) => ({
                                                ...prev,
                                                founderAgreementExternalUrl:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Provide a link or upload directly"
                                        required
                                    />
                                    <FileUpload
                                        limit={1}
                                        onFilesChange={(files) => {
                                            if (files.length) {
                                                setFoundersAgreementFile(
                                                    files[0]
                                                );
                                            } else {
                                                setFoundersAgreementFile(null);
                                            }
                                        }}
                                    />
                                    {foundersAgreementFile && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium">
                                                    {foundersAgreementFile.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFoundersAgreementFile(
                                                        null
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewMember({});
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="button" size="sm" onClick={handleAdd}>
                                Add Member
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center gap-2"
                    >
                        <FiPlus />
                        Add member
                    </button>
                ))}
        </div>
    );
};
