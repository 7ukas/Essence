namespace Essence;

public class PlaylistCreateDto {
    [Required]
    public int OwnerId { get; set; }

    [Required]
    [StringLength(64)]
    public string? Title { get; set; }

    [StringLength(300)]
    public string? Description { get; set; }

    public string? Visibility { get; set; }
}
