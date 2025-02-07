import { supabase } from "@/lib/supabase";

export default async function ArtistPage({ params }) {
    const { data: artist } = await supabase
        .from("artists")
        .select("*, artist_links(*), songs(title, id, cover_image)")
        .eq("id", params.id)
        .single();

    return (
        <div className="p-6">
            <img src={artist.profile_picture} alt={artist.name} className="w-32 h-32 rounded-full" />
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <h2 className="text-xl mt-2">Profiles</h2>
            <ul>
                {artist.artist_links.map((link) => (
                    <li key={link.id}>
                        <a className="text-blue-500" href={link.url} target="_blank">
                            {link.platform_name}
                        </a>
                    </li>
                ))}
            </ul>
            <h2 className="text-xl mt-2">Songs</h2>
            <ul>
                {artist.songs.map((song) => (
                    <li key={song.id}>
                        <a className="text-blue-500" href={`/song/${song.id}`}>
                            {song.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
