"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Select from "react-select";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [newArtistName, setNewArtistName] = useState("");
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Fetch logged-in user
    useEffect(() => {
        async function getUser() {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth"); // Redirect to login if not authenticated
            } else {
                setUser(session.user);
            }
        }

        getUser();
    }, [router]);

    // Fetch existing artists
    useEffect(() => {
        async function fetchArtists() {
            const {data, error} = await supabase.from("artists").select("id, name");
            if (!error) setArtists(data);
        }

        fetchArtists();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !releaseDate || (!selectedArtist && !newArtistName)) {
            alert("Please fill in all required fields.");
            return;
        }

        let artistId = selectedArtist?.value;

        // Create new artist if not selected
        if (!artistId && newArtistName) {
            const {data: newArtist, error: artistError} = await supabase
                .from("artists")
                .insert([{name: newArtistName, created_by: user.id}])
                .select()
                .single();

            if (artistError) {
                alert("Error creating artist: " + artistError.message);
                return;
            }

            artistId = newArtist.id;
            setArtists([...artists, {id: artistId, name: newArtistName}]);
            setNewArtistName("");
        }

        // Insert the song
        const {error: songError} = await supabase.from("songs").insert([
            {
                title,
                artist_id: artistId,
                release_date: releaseDate,
                created_by: user.id,
            },
        ]);

        if (songError) {
            alert("Error adding song: " + songError.message);
        } else {
            setTitle("");
            setReleaseDate("");
            setSelectedArtist(null);
            alert("Song added successfully!");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add a New Song</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Song Title */}
                <div>
                    <label className="block font-medium">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 w-full text-black"
                        required
                    />
                </div>

                {/* Select or Create Artist */}
                <div>
                    <label className="block font-medium">Artist:</label>
                    <Select
                        options={artists.map((artist) => ({
                            value: artist.id,
                            label: artist.name,
                        }))}
                        onChange={(selected) => {
                            setSelectedArtist(selected);
                            setNewArtistName(""); // Clear new artist input
                        }}
                        value={selectedArtist}
                        placeholder="Select existing artist..."
                        className="mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Or enter a new artist name"
                        value={newArtistName}
                        onChange={(e) => {
                            setNewArtistName(e.target.value);
                            setSelectedArtist(null); // Clear selected artist
                        }}
                        className="border p-2 w-full text-black"
                    />
                </div>

                {/* Release Date */}
                <div>
                    <label className="block font-medium">Release Date:</label>
                    <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="border p-2 w-full text-black"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-green-500 text-white p-2">
                    Add Song
                </button>
            </form>
        </div>
    );
}
