namespace Essence;

public class AlbumReadDto {
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Artist { get; set; }
    public string? Genre { get; set; }
    public string? Duration { get; set; }

    public IEnumerable<int>? Ids { get; set; }
    public IEnumerable<string>? Titles { get; set; }
    public IEnumerable<string>? Durations { get; set; }
}
