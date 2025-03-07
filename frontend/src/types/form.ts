import type { UploadableFile } from '@/components';
import { ZodTypeAny } from 'zod';
import { UserSocial } from './auth';

export type FormFieldType =
    | 'textinput'
    | 'date'
    | 'select'
    | 'multiselect'
    | 'textarea'
    | 'file'
    | 'team';

export interface FormFieldValue {
    files?: UploadableFile[];
    teamMembers?: TeamMember[];
    value?: any;
}

export interface FormField {
    key: string;
    type: FormFieldType;
    label: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
    rows?: number;
    options?: Array<{
        id: number;
        label: string;
        value: string;
    }>;
    validations?: ZodTypeAny[];
    value: FormFieldValue;
    invalid?: boolean;
    disabled?: boolean;
    props?: any;
}

export interface FormSection {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
}

export interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    detailedBiography: string;
    socialLinks: SocialLink[];
    resumeExternalUrl: string;
    resumeInternalUrl: string;
    commitmentType: string;
    introduction: string;
    industryExperience: string;
    previousWork?: string;
    founderAgreementExternalUrl?: string;
    founderAgreementInternalUrl?: string;
    isAccountOwner: boolean;
    linkedinUrl?: string;
    created_at: number;
    updated_at?: number;
}

export type SocialLink = Pick<UserSocial, 'id' | 'urlOrHandle' | 'platform'>;

export type FormData = {
    [key: string]: any;
};
