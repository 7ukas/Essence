namespace Essence;

public class PlaylistUpdateDto {
    [StringLength(32)]
    public string? Title { get; set; }

    [StringLength(100)]
    public string? Description { get; set; }

    public string? Visibility { get; set; }
}
