export function determineChannelGroup(
    source: string | null,
    medium: string | null,
    campaign: string | null,
    referrer: string | null,
    urlMatches: {
        gclid?: boolean;
        wbraid?: boolean;
        gbraid?: boolean;
        fbclid?: boolean;
    } = {}
): string {
    const normMedium = medium?.toLowerCase() || '';
    const normSource = source?.toLowerCase() || '';
    const normReferrer = referrer?.toLowerCase() || '';

    const isPaidMedium = ['cpc', 'ppc', 'paidsearch', 'paidsocial', 'paid'].includes(normMedium);
    const isSearchEngine = ['google', 'bing', 'yahoo', 'baidu', 'yandex'].some(s => normSource.includes(s) || normReferrer.includes(s));
    const isSocialNetwork = ['facebook', 'instagram', 'twitter', 't.co', 'linkedin', 'tiktok', 'snapchat', 'pinterest'].some(s => normSource.includes(s) || normReferrer.includes(s));

    if (urlMatches.gclid || urlMatches.wbraid || urlMatches.gbraid || (isPaidMedium && isSearchEngine)) {
        return "Paid Search";
    }

    if (urlMatches.fbclid || (isPaidMedium && isSocialNetwork)) {
        return "Paid Social";
    }

    if (isSearchEngine) {
        return "Organic Search";
    }

    if (isSocialNetwork) {
        return "Organic Social";
    }

    if (normMedium === 'email' || normSource === 'email') {
        return "Email";
    }

    if (normMedium === 'affiliate') {
        return "Affiliate";
    }

    if (referrer && referrer !== "") {
        // If there's a referrer and it wasn't caught by search or social, it's a general referral
        return "Referral";
    }

    if (!referrer && !medium && !source && !campaign) {
        return "Direct";
    }

    return "Other";
}
