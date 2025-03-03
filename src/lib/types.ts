export enum DashboardTabs {
    ALL = "all",
    OWNED = "owned"
}

export type SongItem = {
    id: string;
    title: string;
    slug: string;
    album: string;
    artists: { id: string, name: string, slug: string }[];
    cover_image: string;
    release_date: string;
    created_at: string;
    created_by: { id: string, name: string };
}

export type SongsTableProps = {
    songs: SongItem[],
    totalSongs: number,
    totalOwned: number,
    user: string
}