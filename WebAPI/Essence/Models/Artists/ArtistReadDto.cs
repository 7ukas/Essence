namespace Essence;

public class ArtistReadDto {
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Genres { get; set; }

    public IEnumerable<int>? Ids { get; set; }
    public IEnumerable<string>? Titles { get; set; }
    public IEnumerable<string>? Durations { get; set; }
}
