namespace Essence;

public class UsersAlbumsReadDto {
    public int UserId { get; set; }
    public int Id { get; set; }
    public int ArtistId { get; set; }
    public string? Title { get; set; }
    public string? Artist { get; set; }
    public string? Genre { get; set; }
}
