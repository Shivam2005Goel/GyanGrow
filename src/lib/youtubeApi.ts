// ============================================================
// SYNAPSE Learning Hub — YouTube API Service
// ============================================================

import { YouTubeVideo, YouTubeVideoDetails } from '@/types/learning';
import { YOUTUBE_API_CONFIG, parseDuration, formatViewCount } from '@/data/learningData';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface YouTubeSearchItem {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
        channelId: string;
        publishedAt: string;
        thumbnails: {
            default: { url: string };
            medium: { url: string };
            high: { url: string };
        };
    };
}

interface YouTubeVideoItem {
    id: string;
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
        channelId: string;
        publishedAt: string;
        thumbnails: {
            default: { url: string };
            medium: { url: string };
            high: { url: string };
        };
    };
    contentDetails: {
        duration: string;
    };
    statistics: {
        viewCount: string;
        likeCount: string;
    };
}

interface YouTubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YouTubeSearchItem[];
}

// Search YouTube videos with pagination support for maximum results
export async function searchYouTubeVideos(query: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
        console.warn('YouTube API key not configured. Using mock data.');
        return getMockVideos(query);
    }

    try {
        const allVideos: YouTubeVideo[] = [];
        let nextPageToken: string | undefined = undefined;
        const maxPages = Math.ceil(maxResults / 50); // YouTube API max per page is 50
        let totalFetched = 0;

        for (let page = 0; page < maxPages && totalFetched < maxResults; page++) {
            // Search for educational content with lecture/tutorial keywords
            const educationalQuery = `${query} tutorial lecture course`;
            let searchUrl = `${YOUTUBE_API_CONFIG.baseUrl}/search?part=snippet&q=${encodeURIComponent(educationalQuery)}&type=video&maxResults=50&order=relevance&videoDuration=medium&key=${API_KEY}`;

            if (nextPageToken) {
                searchUrl += `&pageToken=${nextPageToken}`;
            }

            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok) {
                throw new Error('Failed to fetch videos');
            }

            const searchData: YouTubeSearchResponse = await searchResponse.json();
            nextPageToken = searchData.nextPageToken;

            if (!searchData.items || searchData.items.length === 0) {
                break;
            }

            const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

            // Get video details including duration and statistics
            const detailsUrl = `${YOUTUBE_API_CONFIG.baseUrl}/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);

            if (!detailsResponse.ok) {
                throw new Error('Failed to fetch video details');
            }

            const detailsData = await detailsResponse.json();

            const videos = detailsData.items.map((item: YouTubeVideoItem) => ({
                id: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
                duration: item.contentDetails.duration,
                viewCount: parseInt(item.statistics.viewCount) || 0,
                likeCount: parseInt(item.statistics.likeCount) || 0,
            }));

            allVideos.push(...videos);
            totalFetched += videos.length;

            // If no next page token, we've reached the end
            if (!nextPageToken) {
                break;
            }
        }

        // Also search for the original query without educational keywords to get more variety
        const additionalSearchUrl = `${YOUTUBE_API_CONFIG.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=50&order=viewCount&key=${API_KEY}`;
        const additionalSearchResponse = await fetch(additionalSearchUrl);

        if (additionalSearchResponse.ok) {
            const additionalSearchData: YouTubeSearchResponse = await additionalSearchResponse.json();

            if (additionalSearchData.items && additionalSearchData.items.length > 0) {
                const additionalVideoIds = additionalSearchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');
                const additionalDetailsUrl = `${YOUTUBE_API_CONFIG.baseUrl}/videos?part=contentDetails,statistics,snippet&id=${additionalVideoIds}&key=${API_KEY}`;
                const additionalDetailsResponse = await fetch(additionalDetailsUrl);

                if (additionalDetailsResponse.ok) {
                    const additionalDetailsData = await additionalDetailsResponse.json();

                    const additionalVideos = additionalDetailsData.items.map((item: YouTubeVideoItem) => ({
                        id: item.id,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                        channelTitle: item.snippet.channelTitle,
                        channelId: item.snippet.channelId,
                        publishedAt: item.snippet.publishedAt,
                        duration: item.contentDetails.duration,
                        viewCount: parseInt(item.statistics.viewCount) || 0,
                        likeCount: parseInt(item.statistics.likeCount) || 0,
                    }));

                    // Add unique videos only
                    const existingIds = new Set(allVideos.map(v => v.id));
                    for (const video of additionalVideos) {
                        if (!existingIds.has(video.id)) {
                            allVideos.push(video);
                            existingIds.add(video.id);
                        }
                    }
                }
            }
        }

        // Sort by view count (most popular first)
        allVideos.sort((a, b) => b.viewCount - a.viewCount);

        // Return up to maxResults
        return allVideos.slice(0, maxResults);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return getMockVideos(query);
    }
}

// Get video details by ID
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    if (!API_KEY) {
        return getMockVideoById(videoId);
    }

    try {
        const url = `${YOUTUBE_API_CONFIG.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch video details');
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return null;
        }

        const item = data.items[0] as YouTubeVideoItem;
        return {
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt,
            duration: item.contentDetails.duration,
            viewCount: parseInt(item.statistics.viewCount) || 0,
            likeCount: parseInt(item.statistics.likeCount) || 0,
        };
    } catch (error) {
        console.error('Error fetching video details:', error);
        return getMockVideoById(videoId);
    }
}

// Get videos from a playlist
export async function getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
        return getMockVideos('playlist');
    }

    try {
        const allVideos: YouTubeVideo[] = [];
        let nextPageToken: string | undefined = undefined;
        const maxPages = Math.ceil(maxResults / 50);

        for (let page = 0; page < maxPages && allVideos.length < maxResults; page++) {
            let playlistUrl = `${YOUTUBE_API_CONFIG.baseUrl}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;

            if (nextPageToken) {
                playlistUrl += `&pageToken=${nextPageToken}`;
            }

            const playlistResponse = await fetch(playlistUrl);

            if (!playlistResponse.ok) {
                throw new Error('Failed to fetch playlist');
            }

            const playlistData = await playlistResponse.json();
            nextPageToken = playlistData.nextPageToken;

            if (!playlistData.items || playlistData.items.length === 0) {
                break;
            }

            const videoIds = playlistData.items
                .map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId)
                .join(',');

            const detailsUrl = `${YOUTUBE_API_CONFIG.baseUrl}/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);

            if (!detailsResponse.ok) {
                throw new Error('Failed to fetch video details');
            }

            const detailsData = await detailsResponse.json();

            const videos = detailsData.items.map((item: YouTubeVideoItem) => ({
                id: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
                duration: item.contentDetails.duration,
                viewCount: parseInt(item.statistics.viewCount) || 0,
                likeCount: parseInt(item.statistics.likeCount) || 0,
            }));

            allVideos.push(...videos);

            if (!nextPageToken) {
                break;
            }
        }

        return allVideos.slice(0, maxResults);
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        return getMockVideos('playlist');
    }
}

// Get related/recommended videos for a specific video
export async function getRelatedVideos(videoId: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
        return getMockVideos('related');
    }

    try {
        // First get the video details to extract keywords
        const videoDetails = await getVideoDetails(videoId);
        if (!videoDetails) {
            return [];
        }

        // Extract keywords from title and search for related content
        const titleWords = videoDetails.title.split(' ').filter(word => word.length > 3).slice(0, 3).join(' ');
        const searchQuery = `${titleWords} ${videoDetails.channelTitle}`;

        const relatedVideos = await searchYouTubeVideos(searchQuery, maxResults);

        // Filter out the original video
        return relatedVideos.filter(v => v.id !== videoId);
    } catch (error) {
        console.error('Error fetching related videos:', error);
        return getMockVideos('related');
    }
}

// Get popular videos in a category
export async function getPopularVideos(categoryId: string = '27', maxResults: number = 20): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
        return getMockVideos('popular');
    }

    try {
        const url = `${YOUTUBE_API_CONFIG.baseUrl}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=${categoryId}&maxResults=${maxResults}&key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch popular videos');
        }

        const data = await response.json();

        return data.items.map((item: YouTubeVideoItem) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt,
            duration: item.contentDetails.duration,
            viewCount: parseInt(item.statistics.viewCount) || 0,
            likeCount: parseInt(item.statistics.likeCount) || 0,
        }));
    } catch (error) {
        console.error('Error fetching popular videos:', error);
        return getMockVideos('popular');
    }
}

// Mock data fallback when API key is not available
function getMockVideos(query: string): YouTubeVideo[] {
    const mockVideos: YouTubeVideo[] = [
        {
            id: 'RBSGKlAvoiM',
            title: 'Introduction to Data Structures and Algorithms',
            description: 'Learn the fundamentals of data structures and algorithms in this comprehensive tutorial.',
            thumbnail: 'https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
            channelTitle: 'Abdul Bari',
            channelId: 'UCZCFT11CWBi3MHNlGf019nw',
            publishedAt: '2023-01-15T10:00:00Z',
            duration: 'PT45M30S',
            viewCount: 1250000,
            likeCount: 45000,
        },
        {
            id: 'bMknfKXIFA8',
            title: 'React Tutorial for Beginners',
            description: 'Complete React tutorial covering components, hooks, state management and more.',
            thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg',
            channelTitle: 'Academind',
            channelId: 'UCSJbGtTlrDami-tDGPUV9-w',
            publishedAt: '2023-06-01T08:00:00Z',
            duration: 'PT2H10M',
            viewCount: 2100000,
            likeCount: 72000,
        },
        {
            id: 'rfscVS0vtbw',
            title: 'Python Tutorial - Full Course for Beginners',
            description: 'A complete Python tutorial for absolute beginners. Learn Python from scratch.',
            thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg',
            channelTitle: 'freeCodeCamp',
            channelId: 'UC8butISFssTIElRVOmh-0Og',
            publishedAt: '2023-03-10T14:00:00Z',
            duration: 'PT4H26M',
            viewCount: 15000000,
            likeCount: 320000,
        },
        {
            id: 'ukzFI9rgwfU',
            title: 'Machine Learning Basics',
            description: 'Introduction to machine learning concepts, algorithms, and applications.',
            thumbnail: 'https://i.ytimg.com/vi/ukzFI9rgwfU/maxresdefault.jpg',
            channelTitle: 'Stanford',
            channelId: 'UC-EnprmTZC_hBkQKtMk6XZg',
            publishedAt: '2022-09-15T12:00:00Z',
            duration: 'PT55M',
            viewCount: 3200000,
            likeCount: 95000,
        },
        {
            id: 'i7twT3U2_XQ',
            title: 'System Design Interview - Step by Step',
            description: 'Learn how to approach system design interviews with real examples.',
            thumbnail: 'https://i.ytimg.com/vi/i7twT3U2_XQ/maxresdefault.jpg',
            channelTitle: 'Gaurav Sen',
            channelId: 'UCRPMAqdtSgd0Ipeef7iFsKw',
            publishedAt: '2023-02-20T09:00:00Z',
            duration: 'PT38M',
            viewCount: 890000,
            likeCount: 28000,
        },
    ];

    // Filter based on query (simple matching)
    if (query) {
        const lowerQuery = query.toLowerCase();
        return mockVideos.filter(v =>
            v.title.toLowerCase().includes(lowerQuery) ||
            v.description.toLowerCase().includes(lowerQuery)
        );
    }

    return mockVideos;
}

function getMockVideoById(videoId: string): YouTubeVideo | null {
    const videos = getMockVideos('');
    return videos.find(v => v.id === videoId) || null;
}

// Export utility functions
export { parseDuration, formatViewCount };