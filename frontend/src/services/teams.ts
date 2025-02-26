import { TeamMember } from '@/types';
import { getApiUrl, HttpStatusCode } from '@/utils';
import { snakeToCamel } from '@/utils/object';
import { randomId } from '@/utils/random';
import { ApiError } from './errors';

export interface TeamMemberData {
    companyId: string;
    member: TeamMember;
}

export interface TeamMembersResponse {
    teamMembers: TeamMember[];
}

interface TeamMemberResponse {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    title: string;
    social_links: Array<{
        platform: string;
        url_or_handle: string;
    }>;
    personal_website?: string | null;
    is_account_owner: boolean;
    commitment_type: string;
    introduction: string;
    industry_experience: string;
    detailed_biography: string;
    previous_work: string;
    resume_external_url: string;
    resume_internal_url: string;
    founders_agreement_external_url: string;
    founders_agreement_internal_url: string;
    created_at: string;
    updated_at: string;
}

export async function addTeamMember(accessToken: string, data: TeamMemberData) {
    const url = getApiUrl(`/companies/${data.companyId}/team`);

    // Format social links for the API
    const socialLinks = Array.isArray(data.member.socialLinks) 
        ? data.member.socialLinks.map(link => ({
            platform: link.platform,
            url_or_handle: link.urlOrHandle
          }))
        : [];

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: data.member.firstName,
            last_name: data.member.lastName,
            title: data.member.title,
            detailed_biography: data.member.detailedBiography,
            social_links: socialLinks,
            is_account_owner: data.member.isAccountOwner,
            commitment_type: data.member.commitmentType,
            introduction: data.member.introduction,
            industry_experience: data.member.industryExperience,
            previous_work: data.member.previousWork,
            resume_external_url: data.member.resumeExternalUrl,
            resume_internal_url: data.member.resumeInternalUrl,
            founders_agreement_external_url: data.member.founderAgreementExternalUrl,
            founders_agreement_internal_url: data.member.founderAgreementInternalUrl,
        }),
    });

    const json = await res.json();
    if (res.status !== HttpStatusCode.CREATED) {
        throw new ApiError(
            'Failed to add team member',
            res.status,
            json
        );
    }

    // Convert snake_case response to camelCase
    const camelCaseResponse = snakeToCamel(json);
    return camelCaseResponse;
}

export async function deleteTeamMember(
    accessToken: string,
    data: TeamMemberData
) {
    const url = getApiUrl(
        `/companies/${data.companyId}/team/${data.member.id}`
    );
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (res.status !== HttpStatusCode.OK) {
        throw new Error('Failed to remove team member');
    }
    return;
}

export async function getTeamMembers(
    accessToken: string,
    companyId: string
): Promise<TeamMember[]> {
    const url = getApiUrl(`/companies/${companyId}/team`);
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (res.status !== HttpStatusCode.OK) {
        throw new Error('Failed to fetch team members');
    }

    const json = await res.json();
    
    const teamMembers = json.team_members || [] as TeamMemberResponse[];
    return teamMembers.map((member: TeamMemberResponse) => {

        // Transform social_links to match the expected SocialLink format with proper id field
        const socialLinks = (member.social_links || []).map(link => ({
            id: randomId(),
            platform: link.platform,
            urlOrHandle: link.url_or_handle
        }));

        const mappedMember = {
            id: member.id,
            firstName: member.first_name,
            lastName: member.last_name,
            title: member.title,
            detailedBiography: member.detailed_biography || '',
            socialLinks: socialLinks,
            resumeExternalUrl: member.resume_external_url || '',
            resumeInternalUrl: member.resume_internal_url || '',
            commitmentType: member.commitment_type || '',
            introduction: member.introduction || '',
            industryExperience: member.industry_experience || '',
            previousWork: member.previous_work || '',
            founderAgreementExternalUrl: member.founders_agreement_external_url || '',
            founderAgreementInternalUrl: member.founders_agreement_internal_url || '',
            isAccountOwner: member.is_account_owner,
            created_at: parseInt(member.created_at) || 0,
            updated_at: parseInt(member.updated_at) || 0,
        };

        return mappedMember;
    }) as TeamMember[];
}

export interface UploadTeamMemberDocumentData {
    memberId: string;
    companyId: string;
    docType: 'resume' | 'founders_agreement';
    file: File;
}

export interface UploadTeamMemberDocumentResponse {
    url: string;
}

export async function uploadTeamMemberDocument(
    accessToken: string,
    data: UploadTeamMemberDocumentData
) {
    const url = getApiUrl(
        `/companies/${data.companyId}/team/${data.memberId}/${data.docType}/document`
    );

    const formData = new FormData();
    formData.append('file', data.file);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const json = await res.json();
    if (res.status !== HttpStatusCode.CREATED) {
        throw new ApiError(
            'Failed to upload team member document',
            res.status,
            json
        );
    }

    return snakeToCamel(json) as UploadTeamMemberDocumentResponse;
}

export async function updateTeamMember(accessToken: string, data: TeamMemberData) {
    const url = getApiUrl(`/companies/${data.companyId}/team/${data.member.id}`);

    console.log('Sending team member update with social links:', data.member.socialLinks);
    
    let socialLinksValue;
    if (Array.isArray(data.member.socialLinks) && data.member.socialLinks.length === 0) {
        socialLinksValue = null;
        console.log('Sending null for social_links to force backend to clear all links');
    } else {
        socialLinksValue = Array.isArray(data.member.socialLinks) 
            ? data.member.socialLinks.map(link => ({
                platform: link.platform,
                url_or_handle: link.urlOrHandle
              }))
            : [];
    }
        
    const requestBody = {
        first_name: data.member.firstName,
        last_name: data.member.lastName,
        title: data.member.title,
        detailed_biography: data.member.detailedBiography,
        social_links: socialLinksValue,
        commitment_type: data.member.commitmentType,
        introduction: data.member.introduction,
        industry_experience: data.member.industryExperience,
        previous_work: data.member.previousWork,
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const json = await res.json();
    if (res.status !== HttpStatusCode.OK) {
        throw new ApiError(
            'Failed to update team member',
            res.status,
            json
        );
    }

    // Convert snake_case response to camelCase
    const camelCaseResponse = snakeToCamel(json);
    return camelCaseResponse;
}
