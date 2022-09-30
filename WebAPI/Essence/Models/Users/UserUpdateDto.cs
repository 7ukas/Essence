namespace Essence;

public class UserUpdateDto {
    [StringLength(254)]
    public string? Email { get; set; }

    [StringLength(254)]
    public string? Password { get; set; }

    [StringLength(24)]
    public string? Username { get; set; }

    public DateTime BirthDate { get; set; }

    [StringLength(6)]
    public string? Sex { get; set; }
}
