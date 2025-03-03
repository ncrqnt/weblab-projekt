import { createClient } from "@/utils/supabase/server";
import { faker } from "@faker-js/faker/locale/en";
import { generateSlug } from "@/utils/utils";

const userIds = [
    '342276ae-4633-476f-b431-e963f30c6f54',
    '6df28897-8b52-4142-99f6-093ee6b0dc11'
];
const newSongs: { id: string; title: string; }[] = [];
const newArtists: { id: string, name: string }[] = [];

function genUniqueSong() {
    let id: string, title: string;
    do {
        id = faker.string.uuid();
        title = faker.music.songName();
    } while (newSongs.some(song => song.id === id || song.title === title));

    newSongs.push({ id, title });
    return { id: id, title: title };
}

function genUniqueArtist() {
    let id: string, name: string;
    do {
        id = faker.string.uuid();
        name = faker.music.artist();
    } while (newArtists.some(artist => artist.id === id || artist.name === name));

    newArtists.push({ id, name });
    return { id: id, name: name };
}

export async function GET() {
    const supabase = await createClient();

    for (let i = 0; i < 20; i++) {
        const creator = faker.helpers.arrayElement(userIds);
        const song = genUniqueSong();
        const artist = genUniqueArtist();

        await supabase.from('songs').insert({
            id: song.id,
            title: song.title,
            slug: generateSlug(song.title),
            album: faker.helpers.arrayElement([null, faker.music.album()]),
            created_by: creator
        });

        await supabase.from('artists').insert({
            id: artist.id,
            name: artist.name,
            slug: generateSlug(artist.name),
            created_by: creator
        });
    }

    for (const song of newSongs) {
        let artistCount = faker.number.int({ min: 1, max: 3 });

        for (let j = 0; j < artistCount; j++) {
            const randArtist = faker.helpers.arrayElement(newArtists);
            await supabase.from('songs_artists').insert({
                song_id: song.id,
                song_title: song.title,
                artist_id: randArtist.id
            });
        }
    }
}