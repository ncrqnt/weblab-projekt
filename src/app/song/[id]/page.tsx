import { supabase } from "@/lib/supabase";

export default async function SongPage({ params }) {
    const { data: song } = await supabase
        .from("songs")
        .select("*, streaming_links(*)")
        .eq("id", params.id)
        .single();

    return (
        <div className="p-6">
            <img src={song.cover_image} alt={song.title} className="w-32 h-32" />
            <h1 className="text-3xl font-bold">{song.title}</h1>
            {song.album && <h2 className="text-lg italic">Album: {song.album}</h2>}
            <p>Released: {song.release_date}</p>
            <h2 className="text-xl mt-2">Streaming Links</h2>
            <ul>
                {song.streaming_links.map((link) => (
                    <li key={link.id}>
                        <a className="text-blue-500" href={link.url} target="_blank">
                            {link.platform_name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
