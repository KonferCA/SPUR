import { TeamMember } from '@/types';
import { getApiUrl, HttpStatusCode } from '@/utils';
import { snakeToCamel } from '@/utils/object';
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
    linkedin_url: string;
    facebook_url: string;
    instagram_url: string;
    x_url: string;
    bluesky_url: string;
    discord_url: string;
    personal_website: string | null;
    is_account_owner: boolean;
    commitment_type: string;
    introduction: string;
    industry_experience: string;
    detailed_biography: string;
    bio: string;
    previous_work: string;
    resume_external_url: string;
    resume_internal_url: string;
    founders_agreement_external_url: string;
    founders_agreement_internal_url: string;
    created_at: string;
    updated_at: string;
}

// extract handle from url
const extractHandle = (url: string, platform: 'twitter' | 'discord' | 'bluesky' | 'facebook' | 'instagram' | 'linkedin') => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        switch (platform) {
            case 'twitter':
                return urlObj.pathname.split('/').pop() || '';
            case 'discord':
                return urlObj.pathname.split('/').pop() || '';
            case 'bluesky':
                return urlObj.pathname.split('/').pop() || '';
            case 'facebook':
                return urlObj.pathname.split('/').pop() || '';
            case 'instagram':
                return urlObj.pathname.split('/').pop() || '';
            case 'linkedin':
                return urlObj.pathname.split('/').slice(-1)[0] || '';
            default:
                return '';
        }
    } catch {
        return url; // if not a valid URL, return as is
    }
};

export async function addTeamMember(accessToken: string, data: TeamMemberData) {
    const url = getApiUrl(`/companies/${data.companyId}/team`);

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
            linkedin_url: data.member.linkedinUrl,
            facebook_url: data.member.facebookUrl,
            instagram_url: data.member.instagramUrl,
            x_url: data.member.xUrl,
            bluesky_url: data.member.blueskyUrl,
            discord_url: data.member.discordUrl,
            personal_website: data.member.personalWebsite || null,
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

        const mappedMember = {
            id: member.id,
            firstName: member.first_name,
            lastName: member.last_name,
            title: member.title,
            detailedBiography: member.detailed_biography || member.bio || '',
            linkedinUrl: member.linkedin_url || '',
            facebookUrl: member.facebook_url || '',
            instagramUrl: member.instagram_url || '',
            xUrl: member.x_url || '',
            blueskyUrl: member.bluesky_url || '',
            discordUrl: member.discord_url || '',
            personalWebsite: member.personal_website || '',
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

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: data.member.firstName,
            last_name: data.member.lastName,
            title: data.member.title,
            detailed_biography: data.member.detailedBiography,
            linkedin_url: data.member.linkedinUrl,
            facebook_url: data.member.facebookUrl,
            instagram_url: data.member.instagramUrl,
            x_url: data.member.xUrl,
            bluesky_url: data.member.blueskyUrl,
            discord_url: data.member.discordUrl,
            personal_website: data.member.personalWebsite || null,
            commitment_type: data.member.commitmentType,
            introduction: data.member.introduction,
            industry_experience: data.member.industryExperience,
            previous_work: data.member.previousWork,
        }),
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
