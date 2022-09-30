namespace Essence; 

public class MusicReadDto {
    public IEnumerable<ArtistsSearchReadDto>? Artists { get; set; }
    public IEnumerable<AlbumsSearchReadDto>? Albums { get; set; }
    public IEnumerable<TracksSearchReadDto>? Tracks { get; set; }
    public IEnumerable<PlaylistsSearchReadDto>? Playlists { get; set; }
}
