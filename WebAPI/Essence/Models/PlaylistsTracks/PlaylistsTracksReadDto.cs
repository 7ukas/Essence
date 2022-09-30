namespace Essence;

public class PlaylistsTracksReadDto {
    public int PlaylistId { get; set; }
    public int ArtistId { get; set; }
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Artist { get; set; }
    public string? Duration { get; set; }
}
