namespace Essence;

public class PlaylistReadDto {
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Owner { get; set; }
    public int Likes { get; set; }
    public string? Visibility { get; set; }
}
