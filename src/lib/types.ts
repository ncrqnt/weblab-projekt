export enum DashboardTabs {
    ALL,
    OWNED
}

export type SongItem = {
    id: string;
    cover_image: string;
    title: string;
    artists: string[];
    album: string;
    created_at: string;
    created_by: string;
}

export type SongsTableProps = {
    page: number,
    limit: number,
    songs: SongItem[],
    totalSongs: number,
    user: string
}