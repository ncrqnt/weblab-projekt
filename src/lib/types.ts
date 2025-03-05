export enum DashboardTabs {
    ALL = "all",
    OWNED = "owned",
}

export type SongItem = {
    id: string,
    title: string,
    slug: string,
    album: string,
    artists: { id: string, name: string, slug: string }[],
    cover_image: string,
    release_date: string,
    created_at: string,
    created_by: { id: string, name: string },
}

export type SongsTableProps = {
    songs: SongItem[],
    totalSongs: number,
    totalOwned: number,
    user: { id: string, name: string },
}

export type UserItem = {
    id: string,
    name: string,
    role: {
        label: string,
        value: string,
    },
    created_at: string,
    email: string,
    created_by: { id: string, name: string },
    inAuth: boolean,
}

export type ArtistItem = {
    id: string,
    name: string,
    slug: string,
    profile_picture: string,
    created_at: string,
    created_by: { id: string, name: string },
}