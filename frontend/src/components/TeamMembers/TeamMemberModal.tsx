import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { TextInput, TextArea } from '@components';
import { SocialLinks } from '@/components/SocialLinks';
import type { SocialLink } from '@/types';
import { SocialPlatform } from '@/types/auth';

export interface TeamMemberFormData {
    first_name: string;
    last_name: string;
    title: string;
    detailed_biography: string;
    linkedin_url: string;
    facebook_url: string;
    instagram_url: string;
    x_url: string;
    bluesky_url: string;
    discord_url: string;
    is_account_owner: boolean;
    personal_website: string | null;
    commitment_type: string;
    introduction: string;
    industry_experience: string;
    previous_work: string;
    resume_external_url: string;
    resume_internal_url: string;
    founders_agreement_external_url: string;
    founders_agreement_internal_url: string;
    socialLinks: SocialLink[];
}

export interface TeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TeamMemberFormData) => void;
    onRemove?: () => void;
    initialData?: Partial<TeamMemberFormData>;
    mode: 'add' | 'edit';
}

interface FormErrors {
    first_name?: string;
    last_name?: string;
    title?: string;
    detailed_biography?: string;
    linkedin_url?: string;
    personal_website?: string;
    commitment_type?: string;
    introduction?: string;
    industry_experience?: string;
    discord_url?: string;
}

const validateUrl = (url: string): boolean => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
};

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onRemove,
    initialData = {},
    mode
}) => {
    const [formData, setFormData] = useState<TeamMemberFormData>({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        title: initialData.title || '',
        detailed_biography: initialData.detailed_biography || '',
        linkedin_url: initialData.linkedin_url || '',
        facebook_url: initialData.facebook_url || '',
        instagram_url: initialData.instagram_url || '',
        x_url: initialData.x_url || '',
        bluesky_url: initialData.bluesky_url || '',
        discord_url: initialData.discord_url || '',
        is_account_owner: initialData.is_account_owner || false,
        personal_website: initialData.personal_website || null,
        commitment_type: initialData.commitment_type || 'Full-time',
        introduction: initialData.introduction || '',
        industry_experience: initialData.industry_experience || '',
        previous_work: initialData.previous_work || '',
        resume_external_url: initialData.resume_external_url || '',
        resume_internal_url: initialData.resume_internal_url || '',
        founders_agreement_external_url: initialData.founders_agreement_external_url || '',
        founders_agreement_internal_url: initialData.founders_agreement_internal_url || '',
        socialLinks: [],
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Update form data when initialData changes
    useEffect(() => {
        // Convert individual social media URLs to socialLinks array
        const socialLinks: SocialLink[] = [];
        if (initialData.linkedin_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.LinkedIn, urlOrHandle: initialData.linkedin_url });
        if (initialData.facebook_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.Facebook, urlOrHandle: initialData.facebook_url });
        if (initialData.instagram_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.Instagram, urlOrHandle: initialData.instagram_url });
        if (initialData.x_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.X, urlOrHandle: initialData.x_url });
        if (initialData.bluesky_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.BlueSky, urlOrHandle: initialData.bluesky_url });
        if (initialData.discord_url) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.Discord, urlOrHandle: initialData.discord_url });
        if (initialData.personal_website) socialLinks.push({ id: Math.random().toString(36).substring(2, 9), platform: SocialPlatform.CustomUrl, urlOrHandle: initialData.personal_website });

        setFormData({
            first_name: initialData.first_name || '',
            last_name: initialData.last_name || '',
            title: initialData.title || '',
            detailed_biography: initialData.detailed_biography || '',
            linkedin_url: initialData.linkedin_url || '',
            facebook_url: initialData.facebook_url || '',
            instagram_url: initialData.instagram_url || '',
            x_url: initialData.x_url || '',
            bluesky_url: initialData.bluesky_url || '',
            discord_url: initialData.discord_url || '',
            is_account_owner: initialData.is_account_owner || false,
            personal_website: initialData.personal_website || null,
            commitment_type: initialData.commitment_type || 'Full-time',
            introduction: initialData.introduction || '',
            industry_experience: initialData.industry_experience || '',
            previous_work: initialData.previous_work || '',
            resume_external_url: initialData.resume_external_url || '',
            resume_internal_url: initialData.resume_internal_url || '',
            founders_agreement_external_url: initialData.founders_agreement_external_url || '',
            founders_agreement_internal_url: initialData.founders_agreement_internal_url || '',
            socialLinks: socialLinks,
        });
    }, [initialData]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Required fields
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.detailed_biography) newErrors.detailed_biography = 'Bio is required';
        if (!formData.introduction) newErrors.introduction = 'Introduction is required';
        if (!formData.industry_experience) newErrors.industry_experience = 'Industry experience is required';

        // URL validation - only validate URLs that are present in socialLinks
        const socialLinks = formData.socialLinks ?? [];
        for (const link of socialLinks) {
            if (!validateUrl(link.urlOrHandle)) {
                if (link.platform === SocialPlatform.LinkedIn) newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
                if (link.platform === SocialPlatform.CustomUrl) newErrors.personal_website = 'Please enter a valid website URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Transform social links into the expected format
            const socialLinks = formData.socialLinks ?? [];
            const submissionData: TeamMemberFormData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                title: formData.title,
                detailed_biography: formData.detailed_biography,
                linkedin_url: socialLinks.find(link => link.platform === SocialPlatform.LinkedIn)?.urlOrHandle || '',
                facebook_url: socialLinks.find(link => link.platform === SocialPlatform.Facebook)?.urlOrHandle || '',
                instagram_url: socialLinks.find(link => link.platform === SocialPlatform.Instagram)?.urlOrHandle || '',
                x_url: socialLinks.find(link => link.platform === SocialPlatform.X)?.urlOrHandle || '',
                bluesky_url: socialLinks.find(link => link.platform === SocialPlatform.BlueSky)?.urlOrHandle || '',
                discord_url: socialLinks.find(link => link.platform === SocialPlatform.Discord)?.urlOrHandle || '',
                personal_website: socialLinks.find(link => link.platform === SocialPlatform.CustomUrl)?.urlOrHandle || null,
                commitment_type: formData.commitment_type,
                introduction: formData.introduction,
                industry_experience: formData.industry_experience,
                previous_work: formData.previous_work || '',
                resume_external_url: formData.resume_external_url || '',
                resume_internal_url: formData.resume_internal_url || '',
                founders_agreement_external_url: formData.founders_agreement_external_url || '',
                founders_agreement_internal_url: formData.founders_agreement_internal_url || '',
                is_account_owner: formData.is_account_owner,
                socialLinks: socialLinks,
            };

            onSubmit(submissionData);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl">
                    <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium">
                            {mode === 'add' ? 'Add member' : 'Editing ' + formData.first_name + ' ' + formData.last_name}
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    <form 
                        onSubmit={handleSubmit} 
                        className="p-4 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="First name"
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            first_name: e.target.value
                                        }));
                                        if (errors.first_name) {
                                            setErrors(prev => ({ ...prev, first_name: undefined }));
                                        }
                                    }}
                                    error={errors.first_name}
                                />
                            </div>
                            <div className="flex-1">
                                <TextInput
                                    label="Last name"
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            last_name: e.target.value
                                        }));
                                        if (errors.last_name) {
                                            setErrors(prev => ({ ...prev, last_name: undefined }));
                                        }
                                    }}
                                    error={errors.last_name}
                                />
                            </div>
                        </div>

                        <TextInput
                            label="Position / Title"
                            required
                            value={formData.title}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }));
                                if (errors.title) {
                                    setErrors(prev => ({ ...prev, title: undefined }));
                                }
                            }}
                            error={errors.title}
                        />

                        <div>
                            <TextArea
                                label="Brief Bio & Expertise"
                                required
                                value={formData.detailed_biography}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        detailed_biography: e.target.value
                                    }));
                                    if (errors.detailed_biography) {
                                        setErrors(prev => ({ ...prev, detailed_biography: undefined }));
                                    }
                                }}
                                error={errors.detailed_biography}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <TextArea
                                label="Introduction"
                                required
                                value={formData.introduction}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        introduction: e.target.value
                                    }));
                                    if (errors.introduction) {
                                        setErrors(prev => ({ ...prev, introduction: undefined }));
                                    }
                                }}
                                error={errors.introduction}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <TextArea
                                label="Industry Experience"
                                required
                                value={formData.industry_experience}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        industry_experience: e.target.value
                                    }));
                                    if (errors.industry_experience) {
                                        setErrors(prev => ({ ...prev, industry_experience: undefined }));
                                    }
                                }}
                                error={errors.industry_experience}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Social Media & Web Presence
                            </label>
                            <div onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}>
                                <SocialLinks
                                    value={formData.socialLinks}
                                    onChange={(links: SocialLink[]) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            socialLinks: links
                                        }));
                                        // Clear any previous errors related to social links
                                        setErrors(prev => ({
                                            ...prev,
                                            linkedin_url: undefined,
                                            personal_website: undefined,
                                            facebook_url: undefined,
                                            instagram_url: undefined,
                                            x_url: undefined,
                                            bluesky_url: undefined,
                                            discord_url: undefined,
                                        }));
                                    }}
                                    onRemove={(link: SocialLink) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            socialLinks: prev.socialLinks.filter(l => l.id !== link.id)
                                        }));
                                    }}
                                />
                            </div>
                            {errors.linkedin_url && (
                                <p className="mt-1 text-sm text-red-500">{errors.linkedin_url}</p>
                            )}
                            {errors.personal_website && (
                                <p className="mt-1 text-sm text-red-500">{errors.personal_website}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4 border-t">
                            {mode === 'edit' && onRemove && (
                                <button
                                    type="button"
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    onClick={onRemove}
                                >
                                    Remove member
                                </button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                                >
                                    {mode === 'add' ? 'Save Changes' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}; 